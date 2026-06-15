---
title: "Design System Principles"
description: "How to create a consistent and maintainable design system for your projects"
date: 2026-05-20
tags: ["design", "css", "systems"]
categories: ["design"]
draft: false
---

## Core Principles

A good design system starts with a few key principles:

1. **Consistency** — Use the same tokens everywhere
2. **Flexibility** — Don't over-constrain your components
3. **Accessibility** — Design for everyone from the start

## Design Tokens

CSS custom properties are perfect for design tokens:

```css
:root {
  --color-primary: #7c3aed;
  --radius-md: 1rem;
  --shadow-card: 0 2px 20px rgba(0,0,0,0.04);
}
```
