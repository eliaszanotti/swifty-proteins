# 3D, fingerprints and other things

## Swifty Protein

_Summary: This project aims to introduce you to more advance Mobile Frameworks and
app._

```
Version: 5
```

## Contents

- I Forewords
- II Introduction
- III Goals
- IV General instructions
- V Mandatory part
- VI Bonus
- VII Turn-in and peer-evaluation

# Chapter I

# Forewords

Here’s what wikipedia has to say about Pikachu :

Pikachu are a species of Pokemon, fictional creatures that appear in an assortment of comic
books, animated movies and television shows, video games, and trading card games licensed by
The Pokemon Company, a Japanese corporation. The Pikachu design was conceived by Ken
Sugimori. Pikachu first appeared in Pokemon Red and Green in Japan, and later in the first
internationally-released Pokemon video games Pokemon Red and Blue for the original Game
Boy. Pikachu is considered to be the most emblematic pokemon from the starter pack.

Like other species of Pokemon, Pikachu are often captured and groomed by humans to fight
other Pokemon for sport. Pikachu are one of the most well-known varieties of Pokemon, largely
because a Pikachu is a central character in the Pokemon anime series. Pikachu is regarded as
a major character of the Pokemon franchise as well as its mascot, and has become an icon of
Japanese pop culture in recent years.

# Chapter II

# Introduction

The research labNoachlly Global Pharmacetics Drugs & Medicine Inc. needs a protein
visualizer to make the world understand its researches.Noachlly Global Pharmacetics Drugs
& Medicine Inc.works with the mondial protein’s database : the famous PDB (Protein Data
Bank).

You have to use access to this database to build an app which lets you visualize proteins
models according to standardized representation.

To realize this project, you need to use a framework appropriate for your platform (e.g.
SceneKit, ViroCore, filament or other). This high level 3D graphics framework should help you
to create 3D animated scenes and effects in your applications.
Noachlly Global Pharmacetics Drugs & Medicine Inc. recruited you knowing that
you already know mobile development, but they ask you and allow you to go further with
this application.

```
Heal the world, make it a better place. For you. For me. For the entire universe.
Michel Jacques, CEO, Noachlly Global Pharmacetics Drugs & Medicine Inc.
```

# Chapter III

# Goals

This project aims to help you become familiar with :

- 3D rendering in mobile apps (using SceneKit, ViroCore, filament, etc.)
- How fingerprints sensor API works (such as TouchID, BiometricManager, etc.)
- Social sharing APIs for mobile apps.
- Implementing a search bar in a mobile app
- Basic understanding of biochemistry concepts.

# Chapter IV

# General instructions

- You must choose between iOS, android or multiplatform.
- This project will be evaluated by human reviewers only.
- This project must be written using the latest SDK/IDE/languages versions available for
  your chosen platform (Swift/Xcode for iOS or Flutter/Android Studio for Android).
- This project must use the RCSB website to retrieve .pdb files.
- The project must use modern layout techniques such as Auto Layout and constraints to
  ensure a responsive user interface.

# Chapter V

# Mandatory part

To validate the mandatory part you must complete these criteria:

Choose an icon for your appliaction. It must be in accordance with the theme of the appli-
cation.

When the application is launched, it must display a Launch screen. Make sure the launch
screen stays on for some time so we can appreciate it!

```
Login View :
```

- Choose an Authentication system where you can store and manage users accounts.
- A user must be able to create an account and log in with a fingerprint sensor (TouchID
  on iOS, BiometricManager on android) using fingerprint sensor.
- If login fails you must display a popup warning authentication failed.
- If the Phone does not support fingerprint sensor, the user must be able to login with a
  password.
- The Login View should ALWAYS be displayed when launching the app. Meaning if you
  press the Home button and relaunch the app without quitting it, it should show the Login
  View!

Protein List View :

- You must list all the ligands provided in ligands.txt (see resources).
- You should be able to search a ligand through the list.
- If you cannot load the ligand through the website, display a warning popup.
- When loading the ligand, you should display a spinning wheel or any clean loading ani-
  mation.

Protein View:

3D, fingerprints and other things Swifty Protein

- For this part you can use SceneKit on iOS, ViroCore on android or even raw Metal/Vulkan
  anything integrated in a classic app is OK. (No full GameEngine!).
- Display the ligand model in 3D.
- You must use CPK coloring.
- You should at least represent the ligand using Balls and Sticks model
- The atom type should be displayed in a tooltip or a small popup when clicking on the
  atom. The tooltip or popup should disappear when clicking anywhere else on the screen.
  The tooltip or popup should display information about the atom, such as its symbol (e.g.
  C for carbon, H for hydrogen, O for oxygen, etc.).
- Share your model through a ‘Share‘ button
- You should be able to ‘play‘ (zoom, rotate etc.) with the ligand.

# Chapter VI

# Bonus

- Incorporation of alternative models for protein structure visualization.

# Chapter VII

# Turn-in and peer-evaluation

Turn your work in using yourGiTrepository, as usual. Only work present on your repository
will be graded in defense.
