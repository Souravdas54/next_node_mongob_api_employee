"use client";

import React, { useState } from "react";
import { AppBar, Toolbar, Typography, IconButton, Box, Drawer, List, ListItem, ListItemButton, } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import Link from "next/link";
import { usePathname } from "next/navigation";

const navLinks = [
  { name: "Home", path: "/" },
  { name: "Create", path: "../../create" },
  { name: "List", path: "../../list" },
];


export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);

  const pathname = usePathname(); // Tracks active route

  const handleDrawerToggle = () => setMobileOpen(!mobileOpen);


  return (
    <AppBar position="sticky" sx={{ bgcolor: "rgba(0,0,0,0.9)" }}>
      <Toolbar>
        {/* Logo / Title */}
        <Typography variant="h6" sx={{ flexGrow: 1, fontWeight: "bold" }}>
          <Link href="/" style={{ textDecoration: "none", color: "white", fontFamily: "sans-serif", fontSize: '25px' }}>
            SOURAV
          </Link>
        </Typography>


        {/* Desktop Menu */}
        <Box sx={{ display: { xs: "none", md: "flex" }, gap: 3, }}>
          {navLinks.map((link) => (
            <Link key={link.path} href={link.path} style={{
              textDecoration: "none",
              color: pathname === link.path ? "red" : "white", // Active Effect
              fontWeight: pathname === link.path ? "bold" : "normal",
              borderBottom: pathname === link.path ? "2px solid red" : "none", // Active underline
              padding: "5px 10px",
              transition: "color 0.3s ease",
            }}
              onMouseOver={(e) => (e.currentTarget.style.color = "red")} // Hover Effect
              onMouseOut={(e) =>
              (e.currentTarget.style.color = pathname === link.path
                ? "red"
                : "white")
              }
            >
              {link.name}
            </Link>
          ))}
        </Box>

        {/* Mobile Menu Icon */}
        <IconButton
          edge="end"
          color="inherit"
          aria-label="menu"
          onClick={handleDrawerToggle}
          sx={{ display: { md: "none" } }}

        >
          <MenuIcon />
        </IconButton>
      </Toolbar>

      {/* Mobile Drawer */}
      <Drawer anchor="right" open={mobileOpen} onClose={handleDrawerToggle}
        PaperProps={{
          sx: {
            bgcolor: "rgba(0,0,0,0.8)",  // Set background color to black
            color: "rgb(225,225,225)"      // Ensure text color is white for visibility
          }
        }}>

        <List sx={{ width: 200 }}>
          {navLinks.map((link) => (
            <ListItem key={link.path} disablePadding>
              <ListItemButton onClick={handleDrawerToggle}>
                <Link href={link.path} style={{ textDecoration: "none", color: "white", width: "100%", }}>
                  {link.name}
                </Link>
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Drawer>
    </AppBar>
  );
};

