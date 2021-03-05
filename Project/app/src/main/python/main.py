from textblob import TextBlob
import sys

analysis = TextBlob(sys.argv[1])
print(analysis.sentiment.polarity)