<template>
  <div class="lv-header">
    <div class="lv-container">
      <div class="lv-header-content">
        <div class="lv-logo">
          <img :src="content.logoSrc || '../assets/logo.svg'" :alt="content.logoAlt || 'LemonVows Logo'" />
          <h1>{{ content.title || 'LemonVows' }}</h1>
        </div>
        <nav class="lv-nav" :class="{ 'lv-nav-open': isNavOpen }">
          <ul>
            <li v-for="(item, index) in content.navItems" :key="index">
              <a :href="item.link" class="lv-nav-link">{{ item.text }}</a>
            </li>
          </ul>
        </nav>
        <div class="lv-user-menu">
          <div class="lv-user-avatar" @click="toggleDropdown">
            <img :src="content.avatarSrc || '../assets/avatar-placeholder.svg'" alt="User" />
          </div>
          <div class="lv-dropdown" :class="{ 'lv-dropdown-open': isDropdownOpen }">
            <ul>
              <li v-for="(item, index) in content.userMenuItems" :key="index">
                <a :href="item.link">{{ item.text }}</a>
              </li>
            </ul>
          </div>
        </div>
        <button class="lv-mobile-menu-toggle" @click="toggleNav">
          <span></span>
          <span></span>
          <span></span>
        </button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    content: { type: Object, required: true },
  },
  data() {
    return {
      isNavOpen: false,
      isDropdownOpen: false,
    };
  },
  mounted() {
    // Close dropdown when clicking outside
    document.addEventListener('click', this.handleOutsideClick);
  },
  beforeUnmount() {
    // Remove event listener when component is destroyed
    document.removeEventListener('click', this.handleOutsideClick);
  },
  methods: {
    toggleNav() {
      this.isNavOpen = !this.isNavOpen;
    },
    toggleDropdown() {
      this.isDropdownOpen = !this.isDropdownOpen;
    },
    handleOutsideClick(event) {
      const userAvatar = this.$el.querySelector('.lv-user-avatar');
      const dropdown = this.$el.querySelector('.lv-dropdown');
      
      if (userAvatar && dropdown && 
          !userAvatar.contains(event.target) && 
          !dropdown.contains(event.target)) {
        this.isDropdownOpen = false;
      }
    }
  }
};
</script>

<style scoped>
/* Base styles for the header */
.lv-header {
  background-color: #ffffff;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  position: sticky;
  top: 0;
  z-index: 1000;
}

.lv-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 15px;
}

.lv-header-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 70px;
}

/* Logo styles */
.lv-logo {
  display: flex;
  align-items: center;
}

.lv-logo img {
  height: 40px;
  margin-right: 10px;
}

.lv-logo h1 {
  font-size: 1.5rem;
  font-weight: 600;
  color: #333;
  margin: 0;
}

/* Navigation styles */
.lv-nav ul {
  display: flex;
  list-style: none;
  margin: 0;
  padding: 0;
}

.lv-nav li {
  margin: 0 10px;
}

.lv-nav-link {
  color: #555;
  text-decoration: none;
  font-weight: 500;
  padding: 5px 0;
  transition: color 0.3s;
}

.lv-nav-link:hover {
  color: #f8c630;
}

/* User menu styles */
.lv-user-menu {
  position: relative;
}

.lv-user-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  overflow: hidden;
  cursor: pointer;
}

.lv-user-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.lv-dropdown {
  position: absolute;
  top: 50px;
  right: 0;
  background: white;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  border-radius: 4px;
  min-width: 150px;
  display: none;
}

.lv-dropdown-open {
  display: block;
}

.lv-dropdown ul {
  list-style: none;
  margin: 0;
  padding: 0;
}

.lv-dropdown li {
  padding: 0;
}

.lv-dropdown a {
  display: block;
  padding: 10px 15px;
  color: #555;
  text-decoration: none;
  transition: background-color 0.3s;
}

.lv-dropdown a:hover {
  background-color: #f5f5f5;
}

/* Mobile menu toggle */
.lv-mobile-menu-toggle {
  display: none;
  background: none;
  border: none;
  cursor: pointer;
  padding: 10px;
}

.lv-mobile-menu-toggle span {
  display: block;
  width: 25px;
  height: 3px;
  background-color: #555;
  margin: 5px 0;
  transition: transform 0.3s, opacity 0.3s;
}

.lv-toggle-active span:nth-child(1) {
  transform: translateY(8px) rotate(45deg);
}

.lv-toggle-active span:nth-child(2) {
  opacity: 0;
}

.lv-toggle-active span:nth-child(3) {
  transform: translateY(-8px) rotate(-45deg);
}

/* Responsive styles */
@media (max-width: 768px) {
  .lv-nav {
    position: absolute;
    top: 70px;
    left: 0;
    right: 0;
    background: white;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    padding: 20px;
    display: none;
  }
  
  .lv-nav-open {
    display: block;
  }
  
  .lv-nav ul {
    flex-direction: column;
  }
  
  .lv-nav li {
    margin: 10px 0;
  }
  
  .lv-mobile-menu-toggle {
    display: block;
  }
}
</style>
