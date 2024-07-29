#!/usr/bin/env python
# coding: utf-8

from transformers import pipeline
import concurrent.futures

def get_summarizer():
    return pipeline("summarization", model="sshleifer/distilbart-cnn-12-6", framework="pt")

def summarize_chunk(summarizer, text, max_length=150, min_length=30):
    try:
        summary = summarizer(text, max_length=max_length, min_length=min_length, do_sample=False)
        return summary[0]['summary_text']
    except Exception as e:
        print(f"Error summarizing chunk: {e}")
        return ""

def summarize_text(summarizer, text, max_length=150, min_length=30):
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
        final_summary = summarizer(final_summary, max_length=max_length, min_length=min_length, do_sample=False)[0]['summary_text']

    return final_summary