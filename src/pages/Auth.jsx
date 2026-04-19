import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import AnimatedLayout from '../components/layout/AnimatedLayout';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import { useAuth } from '../context/AuthContext';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
};

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [city, setCity] = useState('');
  const [authError, setAuthError] = useState('');
  const { login, signup } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setAuthError('');
      if (isLogin) {
        await login(email, password);
      } else {
        await signup(email, password, name, city);
      }
      navigate('/dashboard');
    } catch (error) {
      setAuthError(error.message);
    }
  };

  return (
    <AnimatedLayout>
      <div className="min-h-screen flex w-full">
        {/* Left Side: Illustration / Gradient */}
        <div className="hidden lg:flex w-1/2 relative items-center justify-center overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-[var(--color-bg-dark)] via-[var(--color-bg-dark)] to-[var(--color-primary)] opacity-20"></div>
          
          <motion.div 
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="relative z-10 p-12 text-left"
          >
            <h2 className="text-5xl font-bold mb-6 tracking-tight">
              Build your <span className="text-[var(--color-primary)]">Adaptive</span> Portfolio
            </h2>
            <p className="text-xl text-[var(--color-text-muted)] max-w-md">
              Store your professional journey and generate tailored portfolios for any job application instantly.
            </p>
          </motion.div>

          {/* Animated decorative circles */}
          <motion.div 
            animate={{ y: [0, -20, 0] }}
            transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
            className="absolute top-20 left-20 w-32 h-32 rounded-full border border-[var(--color-border-subtle)]"
          />
          <motion.div 
            animate={{ y: [0, 30, 0] }}
            transition={{ repeat: Infinity, duration: 6, ease: "easeInOut", delay: 1 }}
            className="absolute bottom-20 right-20 w-48 h-48 rounded-full border border-[var(--color-primary)] opacity-30"
          />
        </div>

        {/* Right Side: Form */}
        <div className="w-full lg:w-1/2 flex items-center justify-center p-8 z-10">
          <Card className="w-full max-w-md p-8" hover={false}>
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              <motion.div variants={itemVariants} className="mb-8 text-center">
                <h3 className="text-3xl font-bold mb-2">{isLogin ? 'Welcome back' : 'Create an account'}</h3>
                <p className="text-[var(--color-text-muted)]">
                  {isLogin ? 'Enter your details to access your dashboard' : 'Start building your personalized portfolio today'}
                </p>
              </motion.div>

              <form onSubmit={handleSubmit} className="space-y-6">
                {authError && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-3 rounded-lg bg-red-500/20 border border-red-500/50 text-red-500 text-sm font-medium text-center">
                    {authError}
                  </motion.div>
                )}
                {!isLogin && (
                  <>
                    <motion.div variants={itemVariants}>
                      <Input 
                        label="Full Name" 
                        type="text" 
                        id="name"
                        required={!isLogin}
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="John Doe"
                      />
                    </motion.div>
                    <motion.div variants={itemVariants}>
                      <Input 
                        label="City" 
                        type="text" 
                        id="city"
                        required={!isLogin}
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        placeholder="New York"
                      />
                    </motion.div>
                  </>
                )}
                
                <motion.div variants={itemVariants}>
                  <Input 
                    label="Email address" 
                    type="email" 
                    id="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                  />
                </motion.div>

                <motion.div variants={itemVariants}>
                  <Input 
                    label="Password" 
                    type="password" 
                    id="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                  />
                </motion.div>

                <motion.div variants={itemVariants}>
                  <Button type="submit" className="w-full py-3">
                    {isLogin ? 'Sign In' : 'Sign Up'}
                  </Button>
                </motion.div>
              </form>

              <motion.div variants={itemVariants} className="mt-6 text-center">
                <button 
                  type="button"
                  onClick={() => {
                    setIsLogin(!isLogin);
                    setAuthError('');
                  }}
                  className="text-sm text-[var(--color-text-muted)] hover:text-white transition-colors"
                >
                  {isLogin ? "Don't have an account? Sign up" : 'Already have an account? Sign in'}
                </button>
              </motion.div>
            </motion.div>
          </Card>
        </div>
      </div>
    </AnimatedLayout>
  );
};

export default Auth;
