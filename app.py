from flask import Flask, request, jsonify, render_template
from transformers import pipeline
from sentence_transformers import SentenceTransformer, util
import json
import numpy as np

app = Flask("Garuda")

# Select from the hub of pre-trained hugging face model
model1_name = 'deepset/roberta-base-squad2'
model2_name = SentenceTransformer('all-MiniLM-L6-v2')
qa = pipeline('question-answering', model=model1_name, tokenizer=model1_name)

json_file_path = 'static/QnAsdictionary.json'
with open(json_file_path, 'r') as file:
    loaded_QA_input = json.load(file)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/answer', methods=['POST'])
def get_answer():

    user_question = request.json['user_question']  # Access user question from JSON payload

    if user_question.lower() in ['hey', 'hello', 'hi', 'greetings']:
        return jsonify({'answer': 'Hello! How can I help you today?'})

    emb1 = model2_name.encode([item["question"] for item in loaded_QA_input])
    emb2 = model2_name.encode(user_question)

    cos_sim = util.cos_sim(emb1, emb2)

    print(cos_sim)

    cos_sim_array = cos_sim.numpy()
    max_value_index = np.argmax(cos_sim_array)
    output = qa(loaded_QA_input[max_value_index]['question'], loaded_QA_input[max_value_index]['context'])
    answer = output['answer']
    print(max_value_index)
    print(output)
    print(answer)
    return jsonify({'answer': answer})

if __name__ == '__main__':
    app.run(debug=True)
