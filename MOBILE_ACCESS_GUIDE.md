# 📱 Mobile Access Guide - Super Simple!

## For Demo Day / Defense

### ✅ What You Need:
- Your laptop with the system running
- Your phone (or anyone's phone)
- Both connected to the **same WiFi network**

---

## 🚀 Quick Start (3 Steps)

### Step 1: Start the Servers

Open **3 terminals** and run:

**Terminal 1 - Backend:**
```bash
cd "C:\Users\DENIS\Documents\good health\server"
npm run dev
```

**Terminal 2 - Patient Dashboard:**
```bash
cd "C:\Users\DENIS\Documents\good health\server\patients dashboard"
npm run dev
```

**Terminal 3 - Admin Dashboard:**
```bash
cd "C:\Users\DENIS\Documents\good health\admin dashboard"
npm run dev
```

### Step 2: Generate QR Code

In a **4th terminal**, run:

```bash
cd "C:\Users\DENIS\Documents\good health\server"
npm run qr
```

This will display a **QR code** for the patient dashboard in the terminal!

### Step 3: Scan with Phone

1. Open your phone camera app
2. Point it at the **Patient Dashboard QR code** on your laptop screen
3. Tap the notification that appears
4. The patient dashboard opens automatically on your phone!

**That's it!** ✨

**Note:** Only the patient dashboard needs to be on mobile. The admin dashboard stays on your laptop at `localhost:5173`.

---

## 🎯 For Your Defense Presentation

### Before You Start:
1. Connect your laptop to the venue's WiFi
2. Connect your phone to the same WiFi
3. Run `npm run qr` to generate new QR codes
4. Take a screenshot of the QR codes (for backup)

### During Demo:
- **Show on laptop:** Admin dashboard managing patients
- **Show on phone:** Patient dashboard booking appointments
- **Show real-time updates:** When patient books on phone, it appears on laptop admin view

### If Someone Asks "How do I access it?":
1. Show them the QR code on your screen
2. They scan it with their camera
3. Done!

---

## 🔧 Troubleshooting

### "QR code doesn't work"
- ✅ Check both devices are on same WiFi
- ✅ Check all 3 servers are running
- ✅ Try typing the URL manually (shown below QR code)

### "Different WiFi network"
- Just run `npm run qr` again - it auto-detects the new IP!

### "Phone can't connect"
- Check Windows Firewall (see INSTALLATION_INSTRUCTIONS.txt)
- Make sure servers are running

---

## 💡 Pro Tips

1. **Screenshot the QR codes** - Easy to show multiple people
2. **Practice once before demo** - Make sure everything works
3. **Keep servers running** - Don't close the terminal windows during demo
4. **Backup plan** - If QR doesn't work, you can type the URL manually (shown in terminal)

---

## 📊 What The Evaluators Will See

### On Your Laptop (Admin View):
- Real-time patient management
- Appointment scheduling
- Department management
- Online/offline status of users

### On Phone (Patient View):
- Mobile-friendly interface
- Book appointments
- View queue status
- Manage profile

### The "WOW" Factor:
- Book appointment on phone → Instantly appears on laptop
- Logout on phone → Status changes to "Offline" on laptop
- **Zero configuration needed** - Just scan QR code!

---

## ⚡ Quick Reference

| What | Command |
|------|---------|
| Start backend | `npm run dev` (in server folder) |
| Start patient dashboard | `npm run dev` (in patients dashboard folder) |
| Start admin dashboard | `npm run dev` (in admin dashboard folder) |
| **Generate QR codes** | `npm run qr` (in server folder) |

**That's all you need to know!** 🎉

Good luck with your defense! 🚀
