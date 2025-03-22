from typing import List
from scholarly import scholarly
from config import client

def get_scholarly_references(topics: List[str]):
    try:
        query_prompt = f"""As a research expert, construct the optimal search query for Google Scholar that would 
        return the most relevant academic papers on the main technological, organizational, or structural change mentioned in this communication task: {', '.join(topics)}. Only return the query you would use to search for these papers."""
        
        response = client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[
                {"role": "system", "content": "You are a research expert tasked with finding scholarly references related to the main topics. Your result only needs to be the search query you would use to find these papers."},
                {"role": "user", "content": query_prompt}
            ],
        )
        
        query = response.choices[0].message.content
        search_results = scholarly.search_pubs(query)
        results = []
        
        for i in range(5):  # Get top 5 results
            try:
                result = next(search_results)
                results.append({
                    "title": result['bib']['title'],
                    "url": result['pub_url'] if 'pub_url' in result else "No URL",
                    "abstract": result['bib'].get('abstract', 'No abstract available')
                })
            except StopIteration:
                break  # No more results
            except Exception as e:
                print(f"Error processing search result: {e}")
                continue
        
        return results
    except Exception as e:
        print(f"Error getting scholarly references: {str(e)}")
        return []