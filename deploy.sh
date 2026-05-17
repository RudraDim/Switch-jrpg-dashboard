#!/bin/bash

echo "--- Envoi vers GitHub... ---"

# Git - Ajout, Commit et Push
git add .

echo "Message du commit : "
read commitMessage

git commit -m "$commitMessage"
git push origin main

# echo "--- Déploiement réussi ! Vercel prend le relais. ---"