from PIL import Image

img = Image.open(r"C:\Users\Henry\Documents\Code\Python\SpotDiff\img.jpg")
pixels = img.load()

otherimg = Image.open(r"C:\Users\Henry\Documents\Code\Python\SpotDiff\testimg.jpg")
otherpx = otherimg.load()

diffimg = Image.new( 'RGB', (img.size[0] , img.size[1]), "black")
diff = diffimg.load()

for x in range(img.size[0]):
    for y in range(img.size[1]):
        if abs(pixels[x, y][0] - otherpx[x, y][0]) + abs(pixels[x, y][1] - otherpx[x, y][1]) + abs(pixels[x, y][2] - otherpx[x, y][2]) > 50:
            diff[x, y] = (255, 0, 0)

diffimg.show()