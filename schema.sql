CREATE TABLE USER (
id INTEGER PRIMARY KEY,-- Incrementing sequence
fName VARCHAR(30),
lName VARCHAR(30),
email VARCHAR(320),
phash VARCHAR(60),
salt VARCHAR(60),
);

--CREATE SEQUENCE uID_seq;
--id INTEGER NOT NULL DEFAULT nextval('uID_sq')

CREATE TABLE SESH (
id VARCHAR(6) PRIMARY KEY,--function needs to generate
sname VARCHAR(30),
);

CREATE TABLE HOST_SESSION (
userID INTEGER FOREIGN KEY REFERENCES USER(id),
sessionID VARCHAR(6) FOREIGN KEY REFERENCES SESH(id),
);

CREATE TABLE ATTENDEE_SESSION (
userID INTEGER FOREIGN KEY REFERENCES USER(id)
sessionID VARCHAR(6) FOREIGN KEY REFERENCES SESH(id),
);

Create TABLE FORM (
id INTEGER PRIMARY KEY,
sessionID VARCHAR (6) FOREIGN KEY REFERENCES SESH(id),
);

CREATE TABLE FORM_QUESTION (
fID INTEGER FOREIGN KEY REFERENCES FORM(id),
qID INTEGER FOREIGN KEY REFERENCES QUESTION(id),
);

Create TABLE QUESTION (
id INTEGER PRIMARY KEY,
question VARCHAR(100),
qtype INT CHECK (type >- 5 AND type < 10),
);

CREATE TABLE QUESTION_ANSWER (
qID INTEGER FOREIGN KEY REFERENCES QUESTION(id),
answer VARCHAR (1000),
userID INTEGER  FOREIGN KEY REFERENCES USER(id),
);

CREATE TABLE QUESTION_CHOICE (
qID INTEGER FOREIGN KEY REFERENCES QUESTION(id),
choice VARCHAR(100),
);


CREATE TABLE CHAT (
sessionID VARCHAR(6) FOREIGN KEY REFERENCES SESH(id),
msg VARCHAR(1000),
userID INTEGER FOREIGN KEY REFERENCES USER(id),
stamp DATE,
)
