from PIL import Image

# Load the logo
img = Image.open(r'D:\kaoinai-website\logo.png').convert('RGBA')
data = img.getdata()

new_data = []
for item in data:
    r, g, b, a = item
    # Calculate how "white" this pixel is (all channels high)
    whiteness = max(r, g, b)
    min_channel = min(r, g, b)
    
    # If the pixel is very white (all channels high and close together), make transparent
    if whiteness > 240 and (whiteness - min_channel) < 20:
        # Fully transparent white
        new_data.append((255, 255, 255, 0))
    elif whiteness > 220 and (whiteness - min_channel) < 30:
        # Near-white pixels - partially transparent for anti-aliasing
        alpha = int(255 * (1 - (whiteness - 220) / 35))
        new_data.append((r, g, b, max(0, alpha)))
    else:
        # Keep the pixel as-is
        new_data.append((r, g, b, a))

img.putdata(new_data)
img.save(r'D:\kaoinai-website\logo.png')
print('Logo saved with transparent background')
