#!/usr/bin/env python
# coding: utf-8

from transformers import PegasusForConditionalGeneration, PegasusTokenizer
import concurrent.futures

def get_summarizer():
    model = PegasusForConditionalGeneration.from_pretrained('google/pegasus-xsum')
    tokenizer = PegasusTokenizer.from_pretrained('google/pegasus-xsum')
    return (model, tokenizer)

def summarize_chunk(summarizer, text, max_length=150, min_length=30):
    try:
        model, tokenizer = summarizer
        inputs = tokenizer(text, return_tensors="pt", max_length=512, truncation=True)
        outputs = model.generate(inputs['input_ids'], max_length=max_length, min_length=min_length, length_penalty=2.0, num_beams=4, early_stopping=True)
        summary = tokenizer.decode(outputs[0], skip_special_tokens=True)
        return summary
    except Exception as e:
        print(f"Error summarizing chunk: {e}")
        return ""

def summarize_text(summarizer, text, max_length=150, min_length=30, mode='Paragraph'):
    # Split the text into chunks of 1000 characters
    chunks = [text[i:i+1000] for i in range(0, len(text), 1000)]
    summaries = []

    with concurrent.futures.ThreadPoolExecutor() as executor:
        futures = [executor.submit(summarize_chunk, summarizer, chunk, max_length, min_length) for chunk in chunks]
        for future in concurrent.futures.as_completed(futures):
            summaries.append(future.result())
    
    # Join the summaries
    final_summary = ' '.join(summaries)

    # If the final summary is still too long, summarize it again
    if len(final_summary) > 1000:
        model, tokenizer = summarizer
        inputs = tokenizer(final_summary, return_tensors="pt", max_length=512, truncation=True)
        outputs = model.generate(inputs['input_ids'], max_length=max_length, min_length=min_length, length_penalty=2.0, num_beams=4, early_stopping=True)
        final_summary = tokenizer.decode(outputs[0], skip_special_tokens=True)
    
    split_final_text = final_summary.split('..')
    final_summary = ' '.join(split_final_text)
    
     # Convert to bullet points if mode is 'Bullet Points'
    if mode == 'Bullet Points':
        sentences = final_summary.split('. ')
        final_summary = '\n'.join([f"• {sentence.strip()}" for sentence in sentences if sentence.strip()])

    return final_summary