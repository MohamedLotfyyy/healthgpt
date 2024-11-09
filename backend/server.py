# from flask import Flask, request, jsonify
# import joblib

# app = Flask(__name__)

# # Load the pre-trained model
# model = joblib.load('random_forest_model.joblib')  # Adjust the path as necessary

# @app.route('/predict', methods=['POST'])
# def predict():
#     data = request.get_json()
#     symptoms_vector = data['symptoms']
    
#     # Perform prediction
#     prediction = model.predict([symptoms_vector])
#     predicted_disease = int(prediction[0])  # Convert to a standard Python int
    
#     # Return the prediction result
#     return jsonify({'disease': predicted_disease})

# if __name__ == '__main__':
#     app.run(host='0.0.0.0', port=5001)

from flask import Flask, request, jsonify
from transformers import AutoTokenizer, AutoModelForCausalLM

# Load model and tokenizer
model_name = "AdaptLLM/medicine-LLM"
tokenizer = AutoTokenizer.from_pretrained(model_name, legacy=False)  # Disable legacy mode
model = AutoModelForCausalLM.from_pretrained(model_name)

app = Flask(__name__)

# Endpoint for symptom analysis (suggesting conditions)
@app.route('/analyze_symptoms', methods=['POST'])
def analyze_symptoms():
    data = request.json
    symptoms = data.get("symptoms", [])
    symptoms_text = ', '.join(symptoms)
    prompt = f"A patient presents with the following symptoms: {symptoms_text}. What possible conditions could this indicate?"
    inputs = tokenizer(prompt, return_tensors="pt")
    output = model.generate(inputs['input_ids'], max_length=150, num_return_sequences=1)
    result = tokenizer.decode(output[0], skip_special_tokens=True)
    return jsonify({"conditions": result})

# Endpoint for general health advice
@app.route('/general_advice', methods=['POST'])
def general_advice():
    data = request.json
    symptoms = data.get("symptoms", [])
    symptoms_text = ', '.join(symptoms)
    prompt = f"A patient has symptoms like {symptoms_text}. What general health precautions, diet, or lifestyle advice would you recommend?"
    inputs = tokenizer(prompt, return_tensors="pt")
    output = model.generate(inputs['input_ids'], max_length=150, num_return_sequences=1)
    result = tokenizer.decode(output[0], skip_special_tokens=True)
    return jsonify({"advice": result})

if __name__ == "__main__":
    app.run(port=5000)
