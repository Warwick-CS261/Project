FROM ubuntu:20.10
WORKDIR /Project
RUN apt-get update
RUN apt install --yes --no-install-recommends default-jre
RUN apt install --yes --no-install-recommends default-jdk
RUN apt install --yes --no-install-recommends nodejs
RUN apt install --yes --no-install-recommends npm
RUN apt install --yes --no-install-recommends python3-pip
RUN apt install --yes --no-install-recommends python3-pip
RUN pip3 install nltk
COPY ./Project .
RUN python3 ./dlNLTK.py


ENV GRADLE_HOME /opt/gradle

RUN set -o errexit -o nounset \
    && echo "Adding gradle user and group" \
    && groupadd --system --gid 1000 gradle \
    && useradd --system --gid gradle --uid 1000 --shell /bin/bash --create-home gradle \
    && mkdir /home/gradle/.gradle \
    && chown --recursive gradle:gradle /home/gradle \
    \
    && echo "Symlinking root Gradle cache to gradle Gradle cache" \
    && ln -s /home/gradle/.gradle /root/.gradle

VOLUME /home/gradle/.gradle

WORKDIR /home/gradle

RUN apt-get update \
    && apt-get install --yes --no-install-recommends \
    fontconfig \
    unzip \
    wget \
    \
    bzr \
    git \
    git-lfs \
    mercurial \
    openssh-client \
    subversion \
    && rm -rf /var/lib/apt/lists/*

ENV GRADLE_VERSION 6.8.3
ARG GRADLE_DOWNLOAD_SHA256=7faa7198769f872826c8ef4f1450f839ec27f0b4d5d1e51bade63667cbccd205
RUN set -o errexit -o nounset \
    && echo "Downloading Gradle" \
    && wget --no-verbose --output-document=gradle.zip "https://services.gradle.org/distributions/gradle-${GRADLE_VERSION}-bin.zip" \
    \
    && echo "Checking download hash" \
    && echo "${GRADLE_DOWNLOAD_SHA256} *gradle.zip" | sha256sum --check - \
    \
    && echo "Installing Gradle" \
    && unzip gradle.zip \
    && rm gradle.zip \
    && mv "gradle-${GRADLE_VERSION}" "${GRADLE_HOME}/" \
    && ln --symbolic "${GRADLE_HOME}/bin/gradle" /usr/bin/gradle \
    \
    && echo "Testing Gradle installation" \
    && gradle --version



WORKDIR /Project


RUN ./runGradle




ENV PORT=4000  

EXPOSE 4000


CMD ["gradle", "run"]
