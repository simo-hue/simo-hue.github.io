+++
date = '{{ .Date }}'
draft = true
title = '{{ replace .File.ContentBaseName "-" " " | title }}'
author = 'Simone Mattioli'
tags = ['tag1', 'tag2']  # Aggiungi i tag pertinenti
categories = ['categoria1', 'categoria2']  # Aggiungi le categorie
summary = 'Un breve riassunto del contenuto del post'  # Opzionale, aggiungi un riassunto
+++