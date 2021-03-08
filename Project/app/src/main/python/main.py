#from textblob import TextBlob
from nltk.sentiment import SentimentIntensityAnalyzer
import sys

sia = SentimentIntensityAnalyzer()
results = sia.polarity_scores(sys.argv[1])
print(results['compound'])
#analysis = TextBlob(sys.argv[1])
#print(analysis.sentiment.polarity)
