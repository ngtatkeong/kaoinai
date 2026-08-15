import sys

path = sys.argv[1]
with open(path, 'r', encoding='utf-8') as f:
    data = f.read()

# Add Services link to desktop nav
data = data.replace(
    '        <a href="#features">Platform</a>',
    '        <a href="#services">Services</a>\n        <a href="#features">Platform</a>'
)

# Add Services link to mobile menu
data = data.replace(
    '    <a href="#features" onclick="closeMenu()">Platform</a>',
    '    <a href="#services" onclick="closeMenu()">Services</a>\n    <a href="#features" onclick="closeMenu()">Platform</a>'
)

# Add Services link to footer
data = data.replace(
    '            <li><a href="#features">Platform</a></li>',
    '            <li><a href="#services">Services</a></li>\n            <li><a href="#features">Platform</a></li>'
)

with open(path, 'w', encoding='utf-8') as f:
    f.write(data)

print('Done! Services link added to nav, mobile menu, and footer.')
