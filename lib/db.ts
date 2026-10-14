import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';
import type { Article } from './types';

// Ensure data folder exists
const dataDir = path.join(process.cwd(), 'data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

const dbPath = path.join(dataDir, 'articles.db');
const db = new Database(dbPath);

// Enable WAL mode for fast reads/writes
db.pragma('journal_mode = WAL');

// Initialize database schema
db.exec(`
  CREATE TABLE IF NOT EXISTS articles (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    slug TEXT UNIQUE NOT NULL,
    title TEXT NOT NULL,
    category TEXT NOT NULL,
    excerpt TEXT NOT NULL,
    content TEXT NOT NULL,
    cover_image TEXT,
    tags TEXT,
    author TEXT DEFAULT 'Toshit Kumar',
    read_time TEXT DEFAULT '5 min read',
    featured INTEGER DEFAULT 0,
    views INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );
  CREATE INDEX IF NOT EXISTS idx_slug ON articles(slug);
  CREATE INDEX IF NOT EXISTS idx_category ON articles(category);
`);

// Seed initial articles if empty
const countStmt = db.prepare('SELECT COUNT(*) as count FROM articles');
const { count } = countStmt.get() as { count: number };

if (count === 0) {
  const seedArticles: Omit<Article, 'id' | 'created_at' | 'updated_at'>[] = [
    {
      slug: 'building-autonomous-ai-agents-python',
      title: 'Building Autonomous AI Agents with Local LLMs and Tool Calling in Python',
      category: 'AI',
      excerpt: 'Step-by-step guide on orchestrating multi-agent systems using Ollama, LangChain, and custom API function calling with zero cloud cost.',
      cover_image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&w=1200&q=80',
      tags: 'ai, python, agents, ollama, llm',
      author: 'Toshit Kumar',
      read_time: '6 min read',
      featured: 1,
      views: 142,
      content: `# Building Autonomous AI Agents with Local LLMs

Autonomous AI agents are changing the way software interacts with the real world. In this tutorial, we will construct a lightweight agent framework that connects a locally hosted model with external tools.

## Architecture Overview
The agent operates in a continuous loop:
1. **Perception**: Takes the user goal and conversational history.
2. **Reasoning**: Decides which specialized tool (web search, calculator, terminal) to invoke.
3. **Execution**: Executes the tool call safely and reads the output.
4. **Synthesis**: Delivers the final response or iterates.

\`\`\`python
import requests
import json

class SimpleLocalAgent:
    def __init__(self, model_name="llama3"):
        self.model = model_name
        self.tools = {
            "calculator": lambda expr: eval(expr, {"__builtins__": None}, {})
        }

    def run(self, user_prompt):
        print(f"[*] Processing user prompt: {user_prompt}")
        # Local inference logic here
        return "Agent executed successfully!"

agent = SimpleLocalAgent()
agent.run("Calculate square root of 256")
\`\`\`

## Key Takeaways
- **Zero Cloud Costs**: By utilizing local quantized models via Ollama or vLLM, you maintain 100% data privacy.
- **Strict Function Signatures**: Always enforce JSON schemas for reliable output generation.
- Stay tuned for Part 2 where we attach Arduino telemetry data into our AI reasoning engine!`
    },
    {
      slug: 'esp32-iot-weather-station-oled-blynk',
      title: 'ESP32 Smart IoT Weather Station with OLED & Blynk 2.0 Cloud Integration',
      category: 'Arduino',
      excerpt: 'Build a portable real-time environmental monitor with DHT22, BMP280, 0.96-inch I2C OLED display, and smartphone notifications.',
      cover_image: 'https://images.unsplash.com/photo-1553406830-ef2513450d76?auto=format&fit=crop&w=1200&q=80',
      tags: 'arduino, esp32, iot, sensors, oled',
      author: 'Toshit Kumar',
      read_time: '8 min read',
      featured: 1,
      views: 289,
      content: `# ESP32 Smart IoT Weather Station with OLED & Blynk 2.0

In this project, we will construct a complete wireless weather station powered by the **ESP32 microcontroller**, transmitting temperature, humidity, and barometric pressure directly to a mobile dashboard.

## 🛠️ Required Components
- **ESP32 NodeMCU Development Board**
- **DHT22 / AM2302** (High-precision temperature & humidity sensor)
- **BMP280** (Barometric pressure sensor via I2C)
- **0.96" I2C SSD1306 OLED Display** (128x64 pixels)
- **Breadboard & Jumper Wires**

---

## ⚡ Circuit Schematic & Pin Connections

| ESP32 Pin | Component Pin | Function |
| :--- | :--- | :--- |
| **GPIO 21 (SDA)** | OLED SDA & BMP280 SDA | I2C Data Line |
| **GPIO 22 (SCL)** | OLED SCL & BMP280 SCL | I2C Clock Line |
| **GPIO 4** | DHT22 DATA | Digital Sensor Signal |
| **3V3** | VCC Pins | Power (3.3V) |
| **GND** | GND Pins | Ground Rail |

---

## 💻 Arduino C++ Firmware Code

\`\`\`cpp
#include <WiFi.h>
#include <Wire.h>
#include <Adafruit_GFX.h>
#include <Adafruit_SSD1306.h>
#include <DHT.h>

#define SCREEN_WIDTH 128
#define SCREEN_HEIGHT 64
#define DHTPIN 4
#define DHTTYPE DHT22

Adafruit_SSD1306 display(SCREEN_WIDTH, SCREEN_HEIGHT, &Wire, -1);
DHT dht(DHTPIN, DHTTYPE);

void setup() {
  Serial.begin(115200);
  dht.begin();
  
  if(!display.begin(SSD1306_SWITCHCAPVCC, 0x3C)) {
    Serial.println(F("SSD1306 allocation failed"));
    for(;;);
  }
  
  display.clearDisplay();
  display.setTextSize(1);
  display.setTextColor(WHITE);
  display.setCursor(0, 10);
  display.println("Toshit's Weather Station");
  display.display();
  delay(1500);
}

void loop() {
  float temp = dht.readTemperature();
  float hum = dht.readHumidity();

  display.clearDisplay();
  display.setCursor(0, 0);
  display.print("Temp: ");
  display.print(temp);
  display.println(" C");

  display.setCursor(0, 20);
  display.print("Humidity: ");
  display.print(hum);
  display.println(" %");
  display.display();

  delay(2000);
}
\`\`\`

## Calibration Tips
Make sure to add a 10k pull-up resistor between VCC and the DHT22 data line if your breakout board does not already include one!`
    },
    {
      slug: 'custom-pcb-design-easyeda-jlcpcb-guide',
      title: 'Designing Your First Custom PCB: From EasyEDA to Fabrication',
      category: 'Electronics',
      excerpt: 'Say goodbye to messy breadboards. A comprehensive walkthrough of schematic capture, PCB layout, trace width calculation, and ordering.',
      cover_image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=80',
      tags: 'electronics, pcb, hardware, circuits, fabrication',
      author: 'Toshit Kumar',
      read_time: '7 min read',
      featured: 0,
      views: 195,
      content: `# Designing Your First Custom PCB

Moving your electronics project from a breadboard to a production-grade printed circuit board (PCB) is one of the most rewarding milestones for any maker.

## 1. Schematic Design Rules
- **Decoupling Capacitors**: Place a 100nF ceramic capacitor as close as physically possible to the VCC pin of every IC.
- **Label Nets**: Instead of drawing messy wires across your schematic sheet, use named net flags (\`VCC\`, \`GND\`, \`SDA\`, \`SCL\`).
- **Power Polarity Protection**: Add a Schottky diode (e.g., 1N5819) on the DC input to prevent accidental reverse polarity disaster.

## 2. PCB Layout Best Practices
1. **Trace Widths**:
   - Signal lines: 0.25mm - 0.3mm (10-12 mils)
   - Power traces (3.3V/5V): 0.6mm - 1.0mm (24-40 mils)
2. **Ground Planes**: Always fill both Top and Bottom copper layers with a Ground (GND) pour. This reduces electromagnetic interference (EMI) and provides clean return paths.
3. **Corner Angles**: Avoid 90-degree right angles in traces. Use 45-degree chamfered bends to minimize signal reflection and etching traps.`
    },
    {
      slug: 'davinci-resolve-vs-premiere-pro-2026-workflow',
      title: 'DaVinci Resolve vs Premiere Pro: The Ultimate 4K YouTube Creator Workflow',
      category: 'Editing',
      excerpt: 'Which video editor is best for tech tutorials and high-speed editing? Breakdown of rendering benchmarks, Fusion motion graphics, and audio mastering.',
      cover_image: 'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?auto=format&fit=crop&w=1200&q=80',
      tags: 'editing, video, premiere, davinci, youtube',
      author: 'Toshit Kumar',
      read_time: '5 min read',
      featured: 0,
      views: 312,
      content: `# DaVinci Resolve vs Premiere Pro in 2026

For content creators producing technical tutorials and high-paced YouTube videos, timeline performance and color accuracy are essential.

## Key Comparison Matrix

| Feature | DaVinci Resolve Studio | Adobe Premiere Pro |
| :--- | :--- | :--- |
| **Color Grading** | World-class Node-based grading | Lumetri Color (Layer-based) |
| **Motion Graphics** | Built-in Fusion | After Effects Dynamic Link |
| **Audio Processing** | Fairlight DAW built-in | Essential Sound / Audition |
| **Pricing Model** | One-time lifetime license (\$295) | Monthly subscription |
| **Hardware Decoding** | Incredible GPU optimization | Great Mercury Playback Engine |

## Recommended Export Settings for YouTube (Tech Videos)
- **Container**: MP4
- **Codec**: H.265 / HEVC or AV1 (if your GPU supports hardware encode)
- **Resolution**: 3840 x 2160 (Upscale 1080p footage to 4K to force YouTube's high-bitrate VP09/AV01 codec)
- **Audio**: AAC, 320 kbps, 48kHz Stereo`
    },
    {
      slug: 'dual-axis-solar-tracker-arduino-nano',
      title: 'Dual-Axis Solar Tracker with Arduino Nano and 4 LDR Light Sensors',
      category: 'Projects',
      excerpt: 'Increase solar panel efficiency by up to 40% with dual servo motors, dynamic mathematical differential tracking, and automatic night reset.',
      cover_image: 'https://images.unsplash.com/photo-1509391365360-2e959784a276?auto=format&fit=crop&w=1200&q=80',
      tags: 'projects, arduino, solar, robotics, green-energy',
      author: 'Toshit Kumar',
      read_time: '6 min read',
      featured: 0,
      views: 180,
      content: `# Dual-Axis Solar Tracker Using Arduino Nano

Solar panels generate maximum output when sunlight hits perpendicular to the panel's surface. In this project, we create a dual-axis pan-and-tilt tracking mechanism using two MG996R high-torque servos and four Light Dependent Resistors (LDRs).

## Working Principle
Four LDRs are separated by cross-shaped baffles:
- **Top-Left (TL)**, **Top-Right (TR)**
- **Bottom-Left (BL)**, **Bottom-Right (BR)**

The Arduino calculates:
- Vertical error: \`(TL + TR) - (BL + BR)\`
- Horizontal error: \`(TL + BL) - (TR + BR)\`

If the difference exceeds a deadband threshold, the servos adjust position until sunlight is balanced across all four quadrants.`
    }
  ];

  const insertStmt = db.prepare(`
    INSERT INTO articles (slug, title, category, excerpt, content, cover_image, tags, author, read_time, featured, views)
    VALUES (@slug, @title, @category, @excerpt, @content, @cover_image, @tags, @author, @read_time, @featured, @views)
  `);

  const insertMany = db.transaction((articles: typeof seedArticles) => {
    for (const article of articles) {
      insertStmt.run(article);
    }
  });

  insertMany(seedArticles);
}

// Database helper functions
export const getArticles = (filters?: { category?: string; search?: string; tag?: string }) => {
  let query = 'SELECT * FROM articles WHERE 1=1';
  const params: (string | number)[] = [];

  if (filters?.category && filters.category !== 'All') {
    query += ' AND category = ?';
    params.push(filters.category);
  }

  if (filters?.search) {
    query += ' AND (title LIKE ? OR excerpt LIKE ? OR tags LIKE ?)';
    const searchPattern = `%${filters.search}%`;
    params.push(searchPattern, searchPattern, searchPattern);
  }

  if (filters?.tag) {
    query += ' AND tags LIKE ?';
    params.push(`%${filters.tag}%`);
  }

  query += ' ORDER BY created_at DESC';
  return db.prepare(query).all(...params) as Article[];
};

export const getArticleBySlug = (slug: string) => {
  const stmt = db.prepare('SELECT * FROM articles WHERE slug = ?');
  const article = stmt.get(slug) as Article | undefined;
  
  if (article) {
    // Increment view count
    db.prepare('UPDATE articles SET views = views + 1 WHERE slug = ?').run(slug);
    article.views += 1;
  }
  return article;
};

export const createArticle = (article: Omit<Article, 'id' | 'views' | 'created_at' | 'updated_at'>) => {
  const stmt = db.prepare(`
    INSERT INTO articles (slug, title, category, excerpt, content, cover_image, tags, author, read_time, featured, views)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 0)
  `);
  
  const result = stmt.run(
    article.slug,
    article.title,
    article.category,
    article.excerpt,
    article.content,
    article.cover_image || 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=80',
    article.tags,
    article.author || 'Toshit Kumar',
    article.read_time || '5 min read',
    article.featured || 0
  );
  return result.lastInsertRowid;
};

export const updateArticle = (slug: string, article: Partial<Article>) => {
  const current = getArticleBySlug(slug);
  if (!current) return null;

  const updated = {
    ...current,
    ...article,
    updated_at: new Date().toISOString()
  };

  const stmt = db.prepare(`
    UPDATE articles SET
      title = ?,
      category = ?,
      excerpt = ?,
      content = ?,
      cover_image = ?,
      tags = ?,
      author = ?,
      read_time = ?,
      featured = ?,
      updated_at = CURRENT_TIMESTAMP
    WHERE slug = ?
  `);

  stmt.run(
    updated.title,
    updated.category,
    updated.excerpt,
    updated.content,
    updated.cover_image,
    updated.tags,
    updated.author,
    updated.read_time,
    updated.featured,
    slug
  );
  return updated;
};

export const deleteArticle = (slug: string) => {
  const stmt = db.prepare('DELETE FROM articles WHERE slug = ?');
  const result = stmt.run(slug);
  return result.changes > 0;
};

export const getStats = () => {
  const totalArticles = (db.prepare('SELECT COUNT(*) as count FROM articles').get() as { count: number }).count;
  const totalViews = (db.prepare('SELECT SUM(views) as views FROM articles').get() as { views: number | null }).views || 0;
  const categories = db.prepare('SELECT category, COUNT(*) as count FROM articles GROUP BY category').all() as { category: string; count: number }[];
  
  return {
    totalArticles,
    totalViews,
    categories,
    dbPath: 'data/articles.db (SQLite Embedded)'
  };
};

export default db;
