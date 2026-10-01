import React, { useState } from 'react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { useFinance } from '../../context/FinanceContext';
import { CheckCircle2, ArrowRight } from 'lucide-react';

interface OnboardingFlowProps {
  isOpen: boolean;
  onClose: () => void;
}

export const OnboardingFlow: React.FC<OnboardingFlowProps> = ({
  isOpen,
  onClose,
}) => {
  const { updateUserProfile, updateBudget, budget, setActivePage, openAddModal, showToast } = useFinance();

  const [step, setStep] = useState<number>(1);
  const [selectedGoals, setSelectedGoals] = useState<string[]>(['Daily spending']);
  const [initialMonthlyBudget, setInitialMonthlyBudget] = useState<string>(() => String(budget.totalBudget || ''));
  const [shouldSetBudget, setShouldSetBudget] = useState(false);
  const goals = ['Daily spending', 'Monthly budget', 'Saving money', 'Everything'];

  const handleNext = () => {
    if (step < 4) {
      setStep((s) => s + 1);
    }
  };

  const handleFinish = () => {
    updateUserProfile({
      primaryGoal: selectedGoals.join(', '),
    });

    const parsedBudget = parseFloat(initialMonthlyBudget);
    if (shouldSetBudget && !isNaN(parsedBudget) && parsedBudget > 0) {
      updateBudget({
        ...budget,
        totalBudget: parsedBudget,
      });
    }

    showToast('You’re all set.');
    onClose();
    setActivePage('dashboard');
    openAddModal();
  };

  const handleSkip = () => {
    showToast('Setup skipped. You can add a transaction whenever you’re ready.');
    onClose();
    setActivePage('dashboard');
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleSkip}
      title={step === 1 ? 'Welcome to FinTrack 👋' : step === 4 ? 'You’re all set!' : 'Let’s make money simpler.'}
      description={`Step ${step} of 4`}
      maxWidth="md"
    >
      <div className="space-y-5">
        {/* Step indicator */}
        <div className="flex items-center gap-1.5">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className={`h-1.5 flex-1 rounded-full transition-colors ${
                i <= step ? 'bg-[#0B5D3B]' : 'bg-[#E5E7EB]'
              }`}
            />
          ))}
        </div>

        {step === 1 && (
          <div className="py-3">
            <p className="text-base font-semibold text-[#111111]">Let’s make your money easier to understand.</p>
            <p className="mt-2 text-sm leading-relaxed text-[#6B7280]">Track what you spend, see what’s left, and make a plan that works for you.</p>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-3">
            <span className="text-sm font-semibold text-[#111111] block">What would you like to track?</span>
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
              {goals.map((goal) => (
                <button
                  key={goal}
                  type="button"
                  aria-pressed={selectedGoals.includes(goal)}
                  onClick={() => setSelectedGoals((current) =>
                    current.includes(goal)
                      ? current.filter((item) => item !== goal)
                      : [...current, goal]
                  )}
                  className={`min-h-12 rounded-lg border p-3 text-left text-sm font-medium transition-colors ${
                    selectedGoals.includes(goal)
                      ? 'border-[#0B5D3B] bg-[#0B5D3B]/5 text-[#0B5D3B]'
                      : 'border-[#E5E7EB] bg-white text-[#111111] hover:bg-[#F7F8F6]'
                  }`}
                >
                  {goal}
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-3">
            <span className="text-sm font-semibold text-[#111111] block">Want to set a monthly budget?</span>
            <p className="text-sm text-[#6B7280]">You can always add or change it later.</p>
            <Input
              label="Monthly budget (optional)"
              type="number"
              min="0"
              prefixElement={<span className="text-sm font-semibold">₹</span>}
              value={initialMonthlyBudget}
              onChange={(e) => setInitialMonthlyBudget(e.target.value)}
              placeholder="0"
            />
            <div className="flex flex-wrap gap-2 pt-2">
              <Button variant="primary" size="md" onClick={() => { setShouldSetBudget(true); handleNext(); }}>
                Set budget
              </Button>
              <Button variant="outline" size="md" onClick={() => { setShouldSetBudget(false); handleNext(); }}>
                Skip for now
              </Button>
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="py-4 text-center space-y-3">
            <div className="h-12 w-12 rounded-full bg-[#16845B]/10 text-[#16845B] flex items-center justify-center mx-auto">
              <CheckCircle2 className="h-6 w-6" />
            </div>
            <h3 className="text-base font-bold text-[#111111]">
              Start by adding your first transaction.
            </h3>
            <p className="text-sm text-[#6B7280]">You can change your choices any time in settings.</p>
          </div>
        )}

        <div className="flex items-center justify-between pt-4 border-t border-[#E5E7EB]">
          {step < 4 ? (
            <button
              type="button"
              onClick={handleSkip}
              className="text-xs font-medium text-[#6B7280] hover:text-[#111111]"
            >
              Skip setup
            </button>
          ) : (
            <div />
          )}

          <div className="flex items-center gap-2">
            {step === 1 || step === 2 ? (
              <Button
                variant="primary"
                size="md"
                onClick={handleNext}
                icon={<ArrowRight className="h-4 w-4" />}
              >
                  {step === 1 ? "Let's start" : 'Continue'}
              </Button>
              ) : step === 4 ? (
              <Button
                variant="primary"
                size="md"
                onClick={handleFinish}
              >
                  Add transaction
              </Button>
              ) : null}
              {step > 1 && step < 4 && (
                <button type="button" onClick={() => setStep((current) => current - 1)} className="text-sm font-medium text-[#6B7280] hover:text-[#111111]">
                  Back
                </button>
            )}
          </div>
        </div>
      </div>
    </Modal>
  );
};
