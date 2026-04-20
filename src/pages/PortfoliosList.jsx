import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Trash2, Calendar, Briefcase } from 'lucide-react';
import AnimatedLayout from '../components/layout/AnimatedLayout';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import { useData } from '../context/DataContext';

const PortfoliosList = () => {
  const navigate = useNavigate();
  const { generatedPortfolios, deleteGeneratedPortfolio } = useData();

  return (
    <AnimatedLayout>
      <div className="min-h-screen bg-[var(--color-bg-dark)] py-12 px-6 sm:px-12 relative overflow-hidden">
        <div className="max-w-5xl mx-auto w-full relative z-10">
          <div className="flex items-center mb-12 gap-4">
            <Button 
              variant="ghost" 
              onClick={() => navigate('/dashboard')} 
              className="flex items-center gap-2 p-2"
            >
              <ChevronLeft size={20} />
            </Button>
            <h1 className="text-4xl font-bold tracking-tight">Generated Portfolios</h1>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {generatedPortfolios && generatedPortfolios.length > 0 ? (
              generatedPortfolios.map((portfolio) => (
                <Card key={portfolio.id} hover className="flex flex-col relative overflow-hidden border-t-4 border-indigo-500">
                  <div 
                    onClick={() => navigate(`/portfolio/${portfolio.portfolioId}`, { state: portfolio })}
                    className="cursor-pointer flex-1"
                  >
                    <div className="flex items-center gap-2 mb-4 text-indigo-400 bg-indigo-500/10 w-fit px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider">
                      <Briefcase size={14} /> {portfolio.role}
                    </div>
                    
                    <h3 className="text-xl font-bold mb-2 text-white">
                      {portfolio.user?.displayName || 'Portfolio'}
                    </h3>
                    
                    <p className="text-[var(--color-text-muted)] text-sm line-clamp-3 mb-6">
                      {portfolio.generatedIntro}
                    </p>
                    
                    <div className="flex items-center gap-2 text-xs text-[var(--color-text-muted)] mt-auto pt-4 border-t border-[var(--color-border-subtle)]">
                      <Calendar size={12} />
                      {new Date(portfolio.createdAt).toLocaleDateString(undefined, {
                        year: 'numeric', month: 'short', day: 'numeric'
                      })}
                    </div>
                  </div>
                  
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteGeneratedPortfolio(portfolio.id);
                    }}
                    className="absolute top-4 right-4 p-2 text-red-500 bg-red-500/10 hover:bg-red-500 hover:text-white rounded-lg transition-colors"
                  >
                    <Trash2 size={16} />
                  </button>
                </Card>
              ))
            ) : (
              <div className="col-span-full py-20 text-center border-2 border-dashed border-[var(--color-border-subtle)] rounded-2xl bg-white/5">
                <p className="text-xl text-[var(--color-text-muted)] mb-4">No portfolios generated yet.</p>
                <Button onClick={() => navigate('/generate')}>Generate One Now</Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </AnimatedLayout>
  );
};

export default PortfoliosList;
