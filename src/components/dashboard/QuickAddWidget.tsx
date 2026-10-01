import React, { useState } from 'react';
import { useFinance } from '../../context/FinanceContext';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { TransactionService } from '../../services/transactionService';
import { formatIndianCurrency, formatFullDate } from '../../utils/formatters';
import { ArrowRight, Check, CornerDownLeft } from 'lucide-react';
import { TransactionCategory, TransactionType } from '../../types/finance';

interface QuickAddWidgetProps {
  isOpen: boolean;
  onClose: () => void;
}

export const QuickAddWidget: React.FC<QuickAddWidgetProps> = ({
  isOpen,
  onClose,
}) => {
  const { addTransaction } = useFinance();
  const [inputText, setInputText] = useState('');
  const [hasParsed, setHasParsed] = useState(false);
  const [parseError, setParseError] = useState('');
  const [parsedData, setParsedData] = useState<{
    amount: number;
    category: TransactionCategory;
    type: TransactionType;
    date: string;
    description: string;
  } | null>(null);

  const samplePrompts = [
    'Spent ₹450 on dinner yesterday',
    'Paid ₹320 for an Uber ride',
    'Received ₹12,500 freelance project payout',
    'Got ₹1,850 salary today',
  ];

  const handleInterpret = (textToParse?: string) => {
    const text = textToParse || inputText;
    if (!text.trim()) return;
    const result = TransactionService.quickParseTransaction(text);
    if (result.amount <= 0) {
      setParsedData(null);
      setHasParsed(false);
      setParseError('Add a clear amount, like “Spent ₹450 on lunch”.');
      return;
    }
    setParsedData(result);
    setHasParsed(true);
    setParseError('');
  };

  const handleSave = () => {
    if (!parsedData) return;
    addTransaction({
      amount: parsedData.amount,
      category: parsedData.category,
      type: parsedData.type,
      date: parsedData.date,
      description: parsedData.description,
    });
    setHasParsed(false);
    setParsedData(null);
    setInputText('');
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Quick bar"
      description="Describe the money movement naturally. Finora will detect whether you spent or received money, the amount, category, and date."
      maxWidth="md"
    >
      <div className="space-y-4">
        {/* Input area */}
        <div className="space-y-2">
          <label className="block text-xs font-semibold text-[#111111] uppercase tracking-wider">
            What happened?
          </label>
          <div className="relative">
            <textarea
              rows={3}
              value={inputText}
              onChange={(e) => {
                setInputText(e.target.value);
                setHasParsed(false);
                setParseError('');
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleInterpret();
                }
              }}
              placeholder="e.g. spent ₹450 on lunch yesterday"
              className="w-full rounded-xl border border-[#E5E7EB] bg-white px-3.5 py-2.5 text-sm text-[#111111] placeholder:text-[#9CA3AF] focus:outline-none focus:ring-1 focus:ring-[#0B5D3B] focus:border-[#0B5D3B]"
            />
            <div className="absolute right-3 bottom-3 flex items-center gap-1.5 text-[11px] text-[#6B7280]">
              <CornerDownLeft className="h-3.5 w-3.5" />
              <span>Press Enter</span>
            </div>
          </div>
          {parseError && <p role="alert" className="text-sm text-[#C84A4A]">{parseError}</p>}
        </div>

        {/* Preset Sample Prompts */}
        <div className="space-y-1.5">
          <span className="text-[11px] font-medium text-[#6B7280]">Try an example:</span>
          <div className="flex flex-wrap gap-1.5">
            {samplePrompts.map((prompt) => (
              <button
                key={prompt}
                type="button"
                onClick={() => {
                  setInputText(prompt);
                  handleInterpret(prompt);
                }}
                className="text-xs px-2.5 py-1 rounded-md bg-[#F7F8F6] border border-[#E5E7EB] text-[#4B5563] hover:text-[#111111] hover:bg-[#EAECE8] transition-colors"
              >
                {prompt}
              </button>
            ))}
          </div>
        </div>

        {/* Parsed result for user review */}
        {hasParsed && parsedData && (
          <div className="p-4 rounded-xl bg-[#F7F8F6] border border-[#E5E7EB] space-y-3 animate-in fade-in duration-150">
            <div className="flex items-center justify-between text-xs font-semibold text-[#111111]">
              <span className="flex items-center gap-1.5 text-[#0B5D3B]">
                <Check className="h-4 w-4" />
                <span>We understood this as</span>
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-2.5 rounded-lg bg-white border border-[#E5E7EB]">
                <span className="text-[#6B7280] block text-[11px]">Amount</span>
                <span
                  className={`font-bold text-base tabular-nums mt-0.5 block ${
                    parsedData.type === 'expense' ? 'text-[#C84A4A]' : 'text-[#16845B]'
                  }`}
                >
                  {parsedData.type === 'expense' ? '-' : '+'}
                  {formatIndianCurrency(parsedData.amount)}
                </span>
              </div>

              <div className="p-2.5 rounded-lg bg-white border border-[#E5E7EB]">
                <span className="text-[#6B7280] block text-[11px]">Category</span>
                <span className="font-semibold text-sm text-[#111111] mt-0.5 block">
                  {parsedData.category}
                </span>
              </div>

              <div className="p-2.5 rounded-lg bg-white border border-[#E5E7EB]">
                <span className="text-[#6B7280] block text-[11px]">Date</span>
                <span className="font-semibold text-sm text-[#111111] mt-0.5 block">
                  {formatFullDate(parsedData.date)}
                </span>
              </div>

              <div className="p-2.5 rounded-lg bg-white border border-[#E5E7EB]">
                <span className="text-[#6B7280] block text-[11px]">Description</span>
                <span className="font-semibold text-sm text-[#111111] mt-0.5 block truncate">
                  {parsedData.description}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Footer Actions */}
        <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#E5E7EB]">
          <Button variant="outline" size="md" onClick={onClose}>
            Cancel
          </Button>

          {!hasParsed ? (
            <Button
              variant="primary"
              size="md"
              icon={<ArrowRight className="h-4 w-4" />}
              onClick={() => handleInterpret()}
            >
              Review transaction
            </Button>
          ) : (
            <>
              <Button
                variant="outline"
                size="md"
                onClick={() => {
                  setHasParsed(false);
                  setParsedData(null);
                }}
              >
                Edit
              </Button>
              <Button
                variant="primary"
                size="md"
                icon={<Check className="h-4 w-4" />}
                onClick={handleSave}
              >
                Save
              </Button>
            </>
          )}
        </div>
      </div>
    </Modal>
  );
};
