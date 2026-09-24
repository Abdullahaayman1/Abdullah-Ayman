import os
from PIL import Image as PILImage, ImageDraw, ImageOps
from reportlab.lib.pagesizes import A4
from reportlab.lib import colors
from reportlab.lib.styles import ParagraphStyle
from reportlab.platypus import Paragraph
from reportlab.pdfgen import canvas

PAGE_WIDTH, PAGE_HEIGHT = A4
SIDEBAR_WIDTH = 195
SIDEBAR_COLOR = colors.HexColor("#142233")
SIDEBAR_TEXT_MUTED = colors.HexColor("#9bb0c6")
SIDEBAR_TEXT_WHITE = colors.HexColor("#ffffff")
SIDEBAR_BORDER = colors.HexColor("#263a50")

MAIN_HEADING_COLOR = colors.HexColor("#142233")
MAIN_TEXT_COLOR = colors.HexColor("#2d3748")
MAIN_SUBTEXT_COLOR = colors.HexColor("#4a5568")
MAIN_MUTED_COLOR = colors.HexColor("#718096")
LINE_COLOR = colors.HexColor("#e2e8f0")

def prepare_profile_image(input_path, output_path, size=(280, 310), radius=12):
    if not os.path.exists(input_path):
        return None
    try:
        im = PILImage.open(input_path)
        im = ImageOps.fit(im, size, centering=(0.5, 0.35))
        mask = PILImage.new("L", size, 0)
        draw = ImageDraw.Draw(mask)
        draw.rounded_rectangle([(0, 0), size], radius=radius, fill=255)
        rounded = PILImage.new("RGBA", size, (0, 0, 0, 0))
        rounded.paste(im, (0, 0), mask=mask)
        rounded.save(output_path, "PNG")
        return output_path
    except Exception as e:
        print("Error preparing profile image:", e)
        return input_path

def draw_vector_icon(c, icon_type, x, y, size=11):
    c.saveState()
    c.setStrokeColor(SIDEBAR_TEXT_MUTED)
    c.setFillColor(SIDEBAR_TEXT_MUTED)
    c.setLineWidth(1)
    
    if icon_type == "email":
        # Envelope
        c.roundRect(x, y - 1, size + 1, size - 2, 1.5, fill=0, stroke=1)
        c.line(x, y + size - 3, x + (size + 1)/2, y + 2)
        c.line(x + (size + 1)/2, y + 2, x + size + 1, y + size - 3)
    elif icon_type == "phone":
        # Handset
        c.roundRect(x + 1, y - 2, size - 3, size + 1, 2, fill=0, stroke=1)
        c.circle(x + (size - 1)/2, y + 1, 1, fill=1, stroke=0)
        c.line(x + 3, y + size - 3, x + size - 4, y + size - 3)
    elif icon_type == "web":
        # Link chain
        c.roundRect(x, y + 1, size - 3, size - 4, 2, fill=0, stroke=1)
        c.roundRect(x + 4, y - 2, size - 3, size - 4, 2, fill=0, stroke=1)
    elif icon_type == "location":
        # Pin
        c.circle(x + size/2, y + size/2, (size/2) - 1.5, fill=0, stroke=1)
        c.circle(x + size/2, y + size/2, 1.2, fill=1, stroke=0)
        c.line(x + size/2, y + 1, x + size/2, y - 2)
    elif icon_type == "linkedin":
        # in badge
        c.roundRect(x, y - 2, size, size, 2, fill=1, stroke=0)
        c.setFillColor(SIDEBAR_COLOR)
        c.setFont("Helvetica-Bold", 7.5)
        c.drawString(x + 2, y + 0.5, "in")
    elif icon_type == "calendar":
        # Calendar
        c.roundRect(x, y - 2, size, size, 1.5, fill=0, stroke=1)
        c.line(x, y + size - 5, x + size, y + size - 5)
        c.line(x + 2.5, y + size - 2, x + 2.5, y + size)
        c.line(x + size - 2.5, y + size - 2, x + size - 2.5, y + size)
        
    c.restoreState()

def generate_pdf(output_path, profile_img_path):
    c = canvas.Canvas(output_path, pagesize=A4)

    # ================= PAGE 1 =================
    # Sidebar Background
    c.setFillColor(SIDEBAR_COLOR)
    c.rect(0, 0, SIDEBAR_WIDTH, PAGE_HEIGHT, fill=1, stroke=0)

    # Right Content Background (Pure White)
    c.setFillColor(colors.white)
    c.rect(SIDEBAR_WIDTH, 0, PAGE_WIDTH - SIDEBAR_WIDTH, PAGE_HEIGHT, fill=1, stroke=0)

    # --- SIDEBAR (PAGE 1) ---
    # Name
    c.setFillColor(SIDEBAR_TEXT_WHITE)
    c.setFont("Helvetica-Bold", 24)
    c.drawString(25, PAGE_HEIGHT - 65, "Abdullah")
    c.drawString(25, PAGE_HEIGHT - 92, "Ayman")

    # Title
    c.setFont("Helvetica", 14)
    c.drawString(25, PAGE_HEIGHT - 120, "Full-Stack")
    c.drawString(25, PAGE_HEIGHT - 138, "Developer")

    # Profile Image
    img_y = PAGE_HEIGHT - 295
    if profile_img_path and os.path.exists(profile_img_path):
        c.drawImage(profile_img_path, 25, img_y, width=145, height=140, mask="auto")

    # Contact Details with vector icons
    cy = img_y - 25
    contact_items = [
        ("email",    "abdullahayman4560@gmail.com", None),
        ("phone",    "+92-3074335544", None),
        ("web",      "abdullahayman.online", None),
        ("location", "Lahore, Pakistan", None),
        ("linkedin", "linkedin.com/in/", "abdullah-ayman-753a682ab"),
        ("calendar", "26/08/2003", None),
    ]

    for icon, line1, line2 in contact_items:
        draw_vector_icon(c, icon, 25, cy + 2)
        c.setFont("Helvetica", 8.5)
        c.setFillColor(SIDEBAR_TEXT_WHITE)
        c.drawString(41, cy + 2, line1)
        if line2:
            cy -= 12
            c.drawString(41, cy + 2, line2)
        cy -= 16

    # Summary Section
    cy -= 14
    c.setFont("Helvetica-Bold", 12)
    c.setFillColor(SIDEBAR_TEXT_WHITE)
    c.drawString(25, cy, "SUMMARY")
    
    cy -= 7
    c.setStrokeColor(SIDEBAR_BORDER)
    c.setLineWidth(1)
    c.line(25, cy, 175, cy)

    summary_text = (
        "Computer Science graduate from the University of Management and Technology (UMT) "
        "with a strong foundation in full-stack web development. Skilled in building responsive "
        "and user-friendly web applications using modern frontend and backend technologies. "
        "Familiar with developing RESTful APIs, working with databases, implementing authentication, "
        "and integrating frontend with backend services. Passionate about writing clean, scalable code "
        "and continuously learning new technologies to solve real-world problems."
    )
    
    summary_style = ParagraphStyle(
        "SummaryStyle",
        fontName="Helvetica",
        fontSize=8,
        leading=11.5,
        textColor=SIDEBAR_TEXT_WHITE,
    )
    
    p = Paragraph(summary_text, summary_style)
    w, h = p.wrap(148, 250)
    p.drawOn(c, 25, cy - h - 8)

    # --- RIGHT MAIN CONTENT (PAGE 1) ---
    mx = SIDEBAR_WIDTH + 30
    mw = PAGE_WIDTH - mx - 30
    ry = PAGE_HEIGHT - 65

    # EDUCATION
    c.setFont("Helvetica-Bold", 12)
    c.setFillColor(MAIN_HEADING_COLOR)
    c.drawString(mx, ry, "EDUCATION")
    
    ry -= 6
    c.setStrokeColor(LINE_COLOR)
    c.setLineWidth(1)
    c.line(mx, ry, mx + mw, ry)
    
    ry -= 18
    c.setFont("Helvetica-Bold", 10.5)
    c.setFillColor(MAIN_HEADING_COLOR)
    c.drawString(mx, ry, "Bachelor of Science in Computer Science")
    
    ry -= 15
    c.setFont("Helvetica", 9.5)
    c.setFillColor(MAIN_SUBTEXT_COLOR)
    c.drawString(mx, ry, "University of Management and Technology (UMT)")
    
    ry -= 14
    c.setFont("Helvetica", 9)
    c.setFillColor(MAIN_MUTED_COLOR)
    c.drawString(mx, ry, "10/2022 – 07/2026 | Lahore")

    # LANGUAGES AND FRAMEWORKS
    ry -= 28
    c.setFont("Helvetica-Bold", 12)
    c.setFillColor(MAIN_HEADING_COLOR)
    c.drawString(mx, ry, "LANGUAGES AND FRAMEWORKS")
    
    ry -= 6
    c.setStrokeColor(LINE_COLOR)
    c.line(mx, ry, mx + mw, ry)
    
    ry -= 14
    c.setFont("Helvetica-Bold", 9)
    c.setFillColor(MAIN_SUBTEXT_COLOR)
    c.drawString(mx, ry, "Languages and Frameworks")
    
    frameworks = [
        "HTML",
        "MySQL",
        "Database Management",
        "Computer Network",
        "Python (Pandas, NumPy, Matplotlib, Scikit-learn)",
        "C++",
        "CSS",
        "Artificial Intelligence",
        "Machine Learning",
        "Microsoft Excel",
        "Google Sheets"
    ]
    
    ry -= 13
    c.setFont("Helvetica", 8.5)
    c.setFillColor(MAIN_TEXT_COLOR)
    for fw in frameworks:
        c.drawString(mx + 6, ry, f"•  {fw}")
        ry -= 11.5

    # PROJECTS Header
    ry -= 16
    c.setFont("Helvetica-Bold", 12)
    c.setFillColor(MAIN_HEADING_COLOR)
    c.drawString(mx, ry, "PROJECTS")
    
    ry -= 6
    c.setStrokeColor(LINE_COLOR)
    c.line(mx, ry, mx + mw, ry)

    def draw_project(title, tech, bullets, y):
        c.setFont("Helvetica-Bold", 10)
        c.setFillColor(MAIN_HEADING_COLOR)
        c.drawString(mx, y, title)
        y -= 13
        
        c.setFont("Helvetica-Bold", 8.5)
        c.setFillColor(MAIN_SUBTEXT_COLOR)
        c.drawString(mx, y, "Technologies: ")
        tw = c.stringWidth("Technologies: ", "Helvetica-Bold", 8.5)
        c.setFont("Helvetica", 8.5)
        c.drawString(mx + tw, y, tech)
        y -= 13
        
        bullet_style = ParagraphStyle(
            "Bullet",
            fontName="Helvetica",
            fontSize=8.5,
            leading=11.5,
            textColor=MAIN_TEXT_COLOR,
        )
        
        for b in bullets:
            c.setFont("Helvetica", 8.5)
            c.drawString(mx + 4, y, "•")
            bp = Paragraph(b, bullet_style)
            w, h = bp.wrap(mw - 16, 100)
            bp.drawOn(c, mx + 14, y - h + 9)
            y -= (h + 3.5)
            
        y -= 8
        return y

    # Project 1: E-Commerce
    p1_bullets = [
        "Developed a full-stack e-commerce platform with product browsing, search, filtering, and shopping cart functionality.",
        "Implemented user registration, login, authentication, and role-based access.",
        "Built RESTful APIs for managing users, products, orders, and inventory.",
        "Designed a responsive interface for desktop and mobile devices."
    ]
    ry = draw_project("E-Commerce Web Application", "React.js, Node.js, Express.js, MongoDB", p1_bullets, ry - 14)

    # Project 2: Task Management System
    p2_bullets = [
        "Developed a task management application for creating, updating, deleting, and tracking tasks.",
        "Implemented user authentication and personalized task dashboards.",
        "Integrated frontend with REST APIs for real-time data management.",
        "Added task status, priority, deadlines, and filtering functionality."
    ]
    ry = draw_project("Task Management System", "React.js, Node.js, Express.js, MongoDB", p2_bullets, ry)

    # End Page 1
    c.showPage()

    # ================= PAGE 2 =================
    # Sidebar Background
    c.setFillColor(SIDEBAR_COLOR)
    c.rect(0, 0, SIDEBAR_WIDTH, PAGE_HEIGHT, fill=1, stroke=0)

    # Right Content Background (Pure White)
    c.setFillColor(colors.white)
    c.rect(SIDEBAR_WIDTH, 0, PAGE_WIDTH - SIDEBAR_WIDTH, PAGE_HEIGHT, fill=1, stroke=0)

    # --- SIDEBAR (PAGE 2) ---
    c.setFont("Helvetica-Bold", 12)
    c.setFillColor(SIDEBAR_TEXT_WHITE)
    c.drawString(25, PAGE_HEIGHT - 65, "LANGUAGES")
    
    c.setStrokeColor(SIDEBAR_BORDER)
    c.setLineWidth(1)
    c.line(25, PAGE_HEIGHT - 72, 175, PAGE_HEIGHT - 72)
    
    sy2 = PAGE_HEIGHT - 92
    c.setFont("Helvetica-Bold", 10)
    c.setFillColor(SIDEBAR_TEXT_WHITE)
    c.drawString(25, sy2, "English")
    sy2 -= 13
    c.setFont("Helvetica", 9)
    c.setFillColor(SIDEBAR_TEXT_MUTED)
    c.drawString(25, sy2, "Fluent")
    
    sy2 -= 25
    c.setFont("Helvetica-Bold", 10)
    c.setFillColor(SIDEBAR_TEXT_WHITE)
    c.drawString(25, sy2, "Urdu")
    sy2 -= 13
    c.setFont("Helvetica", 9)
    c.setFillColor(SIDEBAR_TEXT_MUTED)
    c.drawString(25, sy2, "Fluent")

    # --- RIGHT MAIN CONTENT (PAGE 2) ---
    ry2 = PAGE_HEIGHT - 65

    # Project 3: Online Learning Management System
    p3_bullets = [
        "Built a web-based platform where users can browse courses and manage their learning activities.",
        "Developed separate functionality for students and administrators.",
        "Implemented course management, user authentication, and progress tracking.",
        "Created responsive and intuitive UI components using React.js."
    ]
    ry2 = draw_project("Online Learning Management System", "React.js, Node.js, Express.js, MongoDB", p3_bullets, ry2)

    # Project 4: Real-Time Chat Application
    p4_bullets = [
        "Developed a real-time chat application supporting one-to-one messaging.",
        "Implemented user authentication and online/offline user status.",
        "Used Socket.io for real-time message delivery.",
        "Stored user and chat data in MongoDB and designed a responsive chat interface."
    ]
    ry2 = draw_project("Real-Time Chat Application", "React.js, Node.js, Express.js, Socket.io, MongoDB", p4_bullets, ry2)

    # Section 4: SKILLS
    ry2 -= 10
    c.setFont("Helvetica-Bold", 12)
    c.setFillColor(MAIN_HEADING_COLOR)
    c.drawString(mx, ry2, "SKILLS")
    
    ry2 -= 6
    c.setStrokeColor(LINE_COLOR)
    c.line(mx, ry2, mx + mw, ry2)
    
    ry2 -= 20
    col_w = (mw - 15) / 2
    col1_x = mx
    col2_x = mx + col_w + 15
    
    skill_style = ParagraphStyle(
        "Skill",
        fontName="Helvetica",
        fontSize=8.5,
        leading=12,
        textColor=MAIN_TEXT_COLOR,
    )
    
    # Left Skills Column
    s1_y = ry2
    left_skills = [
        ("•  <b>Frontend:</b> HTML5, CSS3, JavaScript (ES6+), React.js, Bootstrap, Tailwind CSS, Responsive Web Design"),
        ("•  <b>Databases:</b> MongoDB, MySQL, SQL"),
        ("•  <b>Tools & Technologies:</b> Git, GitHub, Postman, VS Code, npm, JSON"),
    ]
    for s in left_skills:
        p = Paragraph(s, skill_style)
        w, h = p.wrap(col_w, 150)
        p.drawOn(c, col1_x, s1_y - h)
        s1_y -= (h + 10)
        
    # Right Skills Column
    s2_y = ry2
    right_skills = [
        ("•  <b>Backend:</b> Node.js, Express.js, RESTful APIs, Authentication & Authorization"),
        ("•  <b>Programming Languages:</b> JavaScript, Java, C++, Python"),
    ]
    for s in right_skills:
        p = Paragraph(s, skill_style)
        w, h = p.wrap(col_w, 150)
        p.drawOn(c, col2_x, s2_y - h)
        s2_y -= (h + 10)

    # Save PDF
    c.showPage()
    c.save()
    print("Successfully generated PDF at:", output_path)

if __name__ == "__main__":
    base_dir = os.path.dirname(os.path.abspath(__file__))
    profile_src = os.path.join(base_dir, "public", "profile.jpg")
    profile_out = os.path.join(base_dir, "public", "profile_pdf.png")
    prepare_profile_image(profile_src, profile_out)
    
    targets = [
        os.path.join(base_dir, "public", "portfolio", "Abdullah-Ayman-Resume.pdf"),
        os.path.join(base_dir, "public", "Abdullah-Ayman-Resume.pdf"),
        os.path.join(base_dir, "abdullah-s-digital-canvas-main", "public", "portfolio", "Abdullah-Ayman-Resume.pdf"),
        os.path.join(base_dir, "abdullah-s-digital-canvas-main", "public", "Abdullah-Ayman-Resume.pdf"),
    ]
    
    for t in targets:
        os.makedirs(os.path.dirname(t), exist_ok=True)
        generate_pdf(t, profile_out)
