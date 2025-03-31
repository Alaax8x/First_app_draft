from flask import Flask, jsonify, send_file, send_from_directory, request
from flask_cors import CORS
import pandas as pd
import seaborn as sns
import matplotlib.pyplot as plt
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import classification_report, confusion_matrix
from sklearn.utils import resample
import category_encoders as ce
import os
import dice_ml
import json

app = Flask(__name__, static_folder="static")
CORS(app)

# Global variables to store model-related objects
model = None
encoder = None
dice_data = None
dice_model = None

def initialize_model():
    global model, encoder, dice_data, dice_model
    
    # Read and prepare data
    data = pd.read_csv('data/bankloan.csv')
    data.drop('ID', axis='columns', inplace=True)
    data.drop('ZIP.Code', axis='columns', inplace=True)

    # Converting negatives to their absolute value
    data["Experience"] = abs(data["Experience"])
    
    # Balancing Data
    minority_class = data[data['Personal.Loan'] == 1]
    majority_class = data[data['Personal.Loan'] == 0]
    minority_upsampled = resample(minority_class, replace=True, n_samples=len(majority_class), random_state=42)
    balanced_data = pd.concat([majority_class, minority_upsampled])

    # Prepare DiCE data
    dice_data = dice_ml.Data(dataframe=balanced_data,
                       continuous_features=['Age', 'Experience', 
                                           'CCAvg', 'Mortgage', 'Income', 'Family'],
                       outcome_name='Personal.Loan')

    # Splitting Data
    target = balanced_data["Personal.Loan"]
    balanced_dataX = balanced_data.drop('Personal.Loan', axis=1)

    x_train, x_test, y_train, y_test = train_test_split(
        balanced_dataX, target, test_size=0.25, random_state=0, stratify=target, shuffle=True
    )

    # Encoding Data
    numerical = ['Age', 'Experience', 'CCAvg', 'Mortgage', 'Income', 'Family']
    categorical = x_train.columns.difference(numerical)
    encoder = ce.OrdinalEncoder(cols=categorical)
    x_train = encoder.fit_transform(x_train)
    x_test = encoder.transform(x_test)

    # Model Training
    model = RandomForestClassifier(max_depth=5, random_state=0)
    model.fit(x_train, y_train)
    
    # Initialize DiCE model
    dice_model = dice_ml.Model(model=model, backend="sklearn")

@app.route('/api/ml')
def predict():
    global model, encoder
    
    # Ensure model is initialized
    if model is None:
        initialize_model()
    
    data = pd.read_csv('data/bankloan.csv')
    data.drop('ID', axis='columns', inplace=True)
    data.drop('ZIP.Code', axis='columns', inplace=True)
    
    # Converting negatives to their absolute value
    data["Experience"] = abs(data["Experience"])
    
    # Balancing Data
    minority_class = data[data['Personal.Loan'] == 1]
    majority_class = data[data['Personal.Loan'] == 0]
    minority_upsampled = resample(minority_class, replace=True, n_samples=len(majority_class), random_state=42)
    balanced_data = pd.concat([majority_class, minority_upsampled])

    # Splitting Data
    target = balanced_data["Personal.Loan"]
    balanced_dataX = balanced_data.drop('Personal.Loan', axis=1)

    x_train, x_test, y_train, y_test = train_test_split(
        balanced_dataX, target, test_size=0.25, random_state=0, stratify=target, shuffle=True
    )

    # Model evaluation
    model_predict = model.predict(x_test)

    # Generate Classification Report as a Dictionary
    report = classification_report(y_test, model_predict, output_dict=True)

    # Generate Confusion Matrix
    conf_matrix = confusion_matrix(y_test, model_predict, labels=[1, 0])

    # Plot Confusion Matrix
    plt.figure(figsize=(6, 6))
    sns.heatmap(conf_matrix, annot=True, fmt='g', cmap='PiYG',
                xticklabels=['Approved', 'Declined'], yticklabels=['Approved', 'Declined'])
    plt.xlabel('Predicted Preference', fontsize=12)
    plt.ylabel('Actual Preference', fontsize=12)
    plt.title('Confusion Matrix')

    # Save the plot
    conf_matrix_path = "static/confusion_matrix.png"
    plt.savefig(conf_matrix_path)
    plt.close()

    # Feature Importance Plot
    importances = model.feature_importances_
    feature_names = x_train.columns
    sorted_features = sorted(zip(feature_names, importances), key=lambda x: x[1], reverse=True)
    features, importance_values = zip(*sorted_features)

    plt.figure(figsize=(10, 6))
    sns.barplot(x=importance_values, y=features, palette="viridis")
    plt.xlabel("Feature Importance Score", fontsize=12)
    plt.ylabel("Features", fontsize=12)
    plt.title("Feature Importance in Loan Approval Model", fontsize=14)

    # Save feature importance plot
    feature_importance_path = "static/feature_importance.png"
    plt.savefig(feature_importance_path)
    plt.close()

    return jsonify({
        'report': report,
        'conf_matrix_url': f'http://127.0.0.1:5000/{conf_matrix_path}',
        'feature_importance_url': f'http://127.0.0.1:5000/{feature_importance_path}',
        'html_url': f'http://127.0.0.1:5000/static/random_forest_tree.html'
    })

@app.route('/predict_loan', methods=['POST'])
def predict_loan():
    global model, encoder
    
    # Ensure model is initialized
    if model is None:
        initialize_model()
    
    # Get input data from request
    loan_request = request.json
    
    # Create DataFrame from input
    input_df = pd.DataFrame([loan_request])
    
    # Transform using the encoder
    input_encoded = encoder.transform(input_df)
    
    # Make prediction
    prediction = model.predict(input_encoded)
    prediction_proba = model.predict_proba(input_encoded)
    
    # Get the result
    is_approved = bool(prediction[0])
    approval_probability = float(prediction_proba[0][1])
    
    result = {
        'is_approved': is_approved,
        'approval_probability': approval_probability
    }
    
    # If loan is not approved, generate counterfactuals
    if not is_approved:
        counterfactuals = generate_counterfactuals(loan_request)
        result['counterfactuals'] = counterfactuals
    
    return jsonify(result)

def generate_counterfactuals(query_instance):
    global dice_data, dice_model
    
    features_to_vary = ['Experience', 'Income', 'CCAvg', 'Education',
                        'Securities.Account', 'CD.Account', 'Online', 'CreditCard']
    x = query_instance.get('Experience')

    # Create DiCE explainer
    exp = dice_ml.Dice(dice_data, dice_model, method="genetic")
    
    # Generate counterfactuals
    cf_examples = exp.generate_counterfactuals(
        pd.DataFrame([query_instance]),
        total_CFs=2,
        desired_class="opposite",
        features_to_vary=features_to_vary,
        permitted_range={'Experience': [x, x + 10]}
    )
    
    # Convert counterfactuals to a JSON-serializable format
    cf_list = []
    for i in range(len(cf_examples.cf_examples_list[0].final_cfs_df)):
        cf = cf_examples.cf_examples_list[0].final_cfs_df.iloc[i].to_dict()
        cf_list.append(cf)
    
    # Add metadata about what changed
    changes = []
    for cf in cf_list:
        cf_changes = {}
        for key in query_instance:
            if key in cf and query_instance[key] != cf[key]:
                cf_changes[key] = {
                    'from': query_instance[key],
                    'to': cf[key]
                }
        changes.append(cf_changes)
    
    return {
        'counterfactual_examples': cf_list,
        'changes': changes
    }

# Route to serve the confusion matrix image
@app.route('/static/confusion_matrix.png')
def get_conf_matrix():
    return send_file("static/confusion_matrix.png", mimetype='image/png')

# Route to serve the feature importance image
@app.route('/static/feature_importance.png')
def get_feature_importance():
    return send_file("static/feature_importance.png", mimetype='image/png')

# Route to serve the Random Forest Tree HTML
@app.route('/static/random_forest_tree.html')
def get_tree_html():
    return send_from_directory("static", "random_forest_tree.html")

if __name__ == '__main__':
    os.makedirs("static", exist_ok=True)
    initialize_model()  # Initialize model at startup
    app.run(debug=True)