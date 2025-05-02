import { motion } from 'framer-motion'
import React from 'react'

interface ButtonProps {
  onOpen: () => void;
  setModalTitle: (title: 'Login' | 'Sign Up') => void;
  title: 'Login' | 'Sign Up';
  authMethod?: 'email';
  onAuthMethodSelect?: (method: 'email' | 'google' | 'facebook') => void;
}

const Button = ({
  onOpen,
  setModalTitle,
  title,
  authMethod = 'email',
  onAuthMethodSelect
}: ButtonProps) => {

  const handleClick = () => {
    // Set the modal title (Login or Sign Up)
    setModalTitle(title);

    // If an auth method is specified and there's a handler, call it
    if (authMethod && onAuthMethodSelect) {
      onAuthMethodSelect(authMethod);
    }

    // Open the modal
    onOpen();
  };

  return (
    <motion.button
      onClick={handleClick}
      className="px-4 py-2 rounded-md font-semibold text-white bg-gradient-to-r from-blue-400 to-blue-600 hover:from-blue-500 hover:to-blue-700 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75 transition-all duration-300 ease-in-out"
      whileHover={{
        scale: 1.05,
        transition: { duration: 0.2, ease: "easeInOut" }
      }}
      whileTap={{ scale: 0.95 }}
    >
      {title}
    </motion.button>
  )
}

export default Button
