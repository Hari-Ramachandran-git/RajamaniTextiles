import os
from PIL import Image

images_map = {
    "category-bedsheets.webp": r"C:\Users\harit\.gemini\antigravity\brain\7f58b55d-5c59-49a8-a403-397af742aaee\category_bedsheets_1794807382812.jpg",
    "category-towels.webp": r"C:\Users\harit\.gemini\antigravity\brain\7f58b55d-5c59-49a8-a403-397af742aaee\category_towels_1794807431790.jpg",
    "category-pillows.webp": r"C:\Users\harit\.gemini\antigravity\brain\7f58b55d-5c59-49a8-a403-397af742aaee\category_pillows_1794807467123.jpg",
    "category-beds-mattresses.webp": r"C:\Users\harit\.gemini\antigravity\brain\7f58b55d-5c59-49a8-a403-397af742aaee\category_beds_mattresses_1794807499178.jpg",
    "category-baby-section.webp": r"C:\Users\harit\.gemini\antigravity\brain\7f58b55d-5c59-49a8-a403-397af742aaee\category_baby_section_1794807535760.jpg",
    "category-function-shawls.webp": r"C:\Users\harit\.gemini\antigravity\brain\7f58b55d-5c59-49a8-a403-397af742aaee\category_function_shawls_1794807583402.jpg",
    "category-inner-wears.webp": r"C:\Users\harit\.gemini\antigravity\brain\7f58b55d-5c59-49a8-a403-397af742aaee\category_inner_wears_1794807629302.jpg",
    "category-screens.webp": r"C:\Users\harit\.gemini\antigravity\brain\7f58b55d-5c59-49a8-a403-397af742aaee\category_screens_1794807654286.jpg",
    "category-bed-spread.webp": r"C:\Users\harit\.gemini\antigravity\brain\7f58b55d-5c59-49a8-a403-397af742aaee\category_bed_spread_1794807687178.jpg",
    "category-bedcovers.webp": r"C:\Users\harit\.gemini\antigravity\brain\7f58b55d-5c59-49a8-a403-397af742aaee\category_bedcovers_1794807756888.jpg"
}

output_dir = r"d:\website-project\frontend\public\images"
os.makedirs(output_dir, exist_ok=True)

for target_name, src_path in images_map.items():
    if not os.path.exists(src_path):
        print(f"Error: source not found {src_path}")
        continue
    
    with Image.open(src_path) as im:
        im = im.convert("RGB")
        # Resize to max 800px on the longest side to ensure sharp display and lightweight payload
        width, height = im.size
        target_width = 800
        target_height = int(height * (target_width / width))
        im_resized = im.resize((target_width, target_height), Image.Resampling.LANCZOS)
        
        out_path = os.path.join(output_dir, target_name)
        # Save as webp with quality 82 (optimised WebP under 150 KB)
        im_resized.save(out_path, "WEBP", quality=82, method=6)
        
        file_size_kb = os.path.getsize(out_path) / 1024
        print(f"Saved: {target_name} ({im_resized.size[0]}x{im_resized.size[1]}) - {file_size_kb:.1f} KB")

print("All category images converted.")
