import { motion, AnimatePresence } from 'framer-motion'

interface Props {
  children: React.ReactNode
  name: string,
  isOpen: boolean,
  textColor?: string,
  isActive?: boolean,
  onClick: () => void
}

const ProfileSettingLink = ({ children, name, isOpen, textColor = `text-neutral-400`, isActive, onClick }: Props) => {
  return (
    <a
      href="#"
      onClick={(e) => {
        e.preventDefault();
        onClick();
      }}
      className={`flex p-1 rounded cursor-pointer stroke-[0.75] place-items-center gap-3 transition-colors duration-100 w-full ${isActive === true
        ? 'bg-neutral-700/50 stroke-neutral-100 text-neutral-100'
        : `stroke-neutral-400 ${textColor} hover:stroke-neutral-100 hover:text-neutral-100 hover:bg-neutral-700/30`
        }`}
    >
      {children}

      <AnimatePresence>
        {isOpen &&
          <motion.p
            initial={{ opacity: 0, width: 0 }}
            animate={{ opacity: 1, width: 'auto', transition: { duration: 0.4, delay: 0.1 } }}
            exit={{ opacity: 0, width: 0, transition: { duration: 0.2 } }}
            className={`font-poppins overflow-clip whitespace-nowrap tracking-wide truncate max-w-24 ${isActive === true ? 'text-neutral-100' : textColor}`}>
            {name}
          </motion.p>}
      </AnimatePresence>
    </a>
  )
}

export default ProfileSettingLink