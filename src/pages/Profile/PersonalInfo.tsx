import { motion } from 'framer-motion';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';

export default function PersonalInfo() {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-2xl"
    >
      <h2 className="font-serif italic text-[36px] md:text-[48px] leading-none mb-8">Personal Info</h2>
      
      <div className="bg-white border border-black/10 rounded-[24px] p-8 md:p-10">
        <form className="flex flex-col gap-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input label="First Name" defaultValue="John" />
            <Input label="Last Name" defaultValue="Doe" />
          </div>
          <Input label="Email Address" defaultValue="john.doe@example.com" type="email" />
          <Input label="Phone Number" defaultValue="+91 98765 43210" />
          
          <div className="pt-4 border-t border-black/10 mt-4">
            <h3 className="text-sm font-medium mb-4">Saved Address</h3>
            <Input label="Default Shipping Address" defaultValue="Flat 402, Sea View Apartments, Bandra West, Mumbai 400050" />
          </div>

          <Button type="button" className="w-full md:w-auto mt-4 self-end">
            Save Changes
          </Button>
        </form>
      </div>
    </motion.div>
  );
}
