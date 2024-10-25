+++
date = '{{ .Date }}'
draft = true
title = '{{ replace .File.ContentBaseName "-" " " | title }}'
author = 'Simone Mattioli'
tags = ['tag1', 'tag2']
categories = ['categoria1', 'categoria2']
summary = 'Un breve riassunto del contenuto del post'
+++

[params.sidebar]
  avatar = { enabled = true, src = "simo/resources/_gen/images/img/logo.jpeg", local = true }
  emoji = "👋"
  social = [
    { name = "LinkedIn", url = "https://www.linkedin.com/in/simone-mattioli-581633212/" },
    { name = "Personal YouTube", url = "https://www.youtube.com/@SimosDiary2003" },
    { name = "Instagram", url = "https://www.instagram.com/simo___one" }
  ]