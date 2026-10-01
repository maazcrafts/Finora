import React, { useMemo, useState } from 'react';
import { Bot, ChevronDown, Send, Sparkles, X, Loader2, RotateCcw } from 'lucide-react';
import { useFinance } from '../../context/FinanceContext';
import {
  askFinanceAssistant,
  buildFinanceChatContext,
  ChatMessage,
} from '../../services/financeAssistantService';

const STARTER_PROMPTS = [
  'How can I manage my budget better?',
  'Where am I spending the most?',
  'How can I save more money?',
];

export const FinanceAssistant: React.FC = () => {
  const { transactions, budget } = useFinance();
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const context = useMemo(
    () => buildFinanceChatContext(transactions, budget),
    [transactions, budget]
  );

  const sendMessage = async (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || isSending) return;

    const userMessage: ChatMessage = { role: 'user', content: trimmed };
    const nextMessages = [...messages, userMessage];

    setMessages(nextMessages);
    setInput('');
    setError(null);
    setIsSending(true);

    try {
      const answer = await askFinanceAssistant(nextMessages, context);
      setMessages([...nextMessages, { role: 'assistant', content: answer }]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to get a response.');
    } finally {
      setIsSending(false);
    }
  };

  const clearChat = () => {
    setMessages([]);
    setError(null);
  };

  return (
    <>
      {isOpen && (
        <div className="fixed bottom-24 right-4 z-[60] flex h-[min(650px,calc(100vh-120px))] w-[min(390px,calc(100vw-32px))] flex-col overflow-hidden rounded-2xl border border-[#E5E7EB] bg-white shadow-2xl animate-in fade-in slide-in-from-bottom-3 duration-200 lg:bottom-6 lg:right-6">
          <div className="flex items-center justify-between border-b border-[#E5E7EB] bg-[#0B5D3B] px-4 py-3 text-white">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/15">
                <Bot className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm font-semibold">FinTrack Assistant</p>
                <p className="text-[11px] text-white/75">Your spending & budget helper</p>
              </div>
            </div>
            <div className="flex items-center gap-1">
              {messages.length > 0 && (
                <button
                  type="button"
                  onClick={clearChat}
                  title="New chat"
                  className="rounded-lg p-2 hover:bg-white/10"
                >
                  <RotateCcw className="h-4 w-4" />
                </button>
              )}
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                title="Close assistant"
                className="rounded-lg p-2 hover:bg-white/10"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto bg-[#F7F8F6] p-4">
            {messages.length === 0 ? (
              <div className="flex min-h-full flex-col justify-end">
                <div className="mb-4 rounded-2xl border border-[#E5E7EB] bg-white p-4">
                  <div className="flex items-center gap-2 text-[#0B5D3B]">
                    <Sparkles className="h-4 w-4" />
                    <span className="text-sm font-semibold">Ask about your finances</span>
                  </div>
                  <p className="mt-2 text-xs leading-5 text-[#6B7280]">
                    I can use your FinTrack spending and budget data to explain patterns and suggest practical next steps.
                  </p>
                </div>
                <div className="space-y-2">
                  {STARTER_PROMPTS.map((prompt) => (
                    <button
                      key={prompt}
                      type="button"
                      onClick={() => void sendMessage(prompt)}
                      className="w-full rounded-xl border border-[#E5E7EB] bg-white px-3 py-2.5 text-left text-xs font-medium text-[#374151] transition-colors hover:border-[#0B5D3B]/30 hover:bg-[#0B5D3B]/5"
                    >
                      {prompt}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                {messages.map((message, index) => (
                  <div
                    key={`${message.role}-${index}`}
                    className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[88%] whitespace-pre-wrap rounded-2xl px-3.5 py-2.5 text-xs leading-5 ${
                        message.role === 'user'
                          ? 'rounded-br-md bg-[#0B5D3B] text-white'
                          : 'rounded-bl-md border border-[#E5E7EB] bg-white text-[#374151]'
                      }`}
                    >
                      {message.content}
                    </div>
                  </div>
                ))}
                {isSending && (
                  <div className="flex justify-start">
                    <div className="flex items-center gap-2 rounded-2xl rounded-bl-md border border-[#E5E7EB] bg-white px-3.5 py-2.5 text-xs text-[#6B7280]">
                      <Loader2 className="h-3.5 w-3.5 animate-spin text-[#0B5D3B]" />
                      Thinking…
                    </div>
                  </div>
                )}
                {error && (
                  <div className="rounded-xl border border-[#C84A4A]/20 bg-[#C84A4A]/5 p-3 text-xs leading-5 text-[#9F3030]">
                    {error}
                  </div>
                )}
              </div>
            )}
          </div>

          <form
            onSubmit={(event) => {
              event.preventDefault();
              void sendMessage(input);
            }}
            className="border-t border-[#E5E7EB] bg-white p-3"
          >
            <div className="flex items-end gap-2 rounded-xl border border-[#E5E7EB] bg-[#F7F8F6] p-1.5 focus-within:border-[#0B5D3B]/40">
              <textarea
                value={input}
                onChange={(event) => setInput(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === 'Enter' && !event.shiftKey) {
                    event.preventDefault();
                    void sendMessage(input);
                  }
                }}
                rows={1}
                maxLength={1000}
                placeholder="Ask about your budget…"
                className="max-h-24 min-h-9 flex-1 resize-none bg-transparent px-2 py-2 text-xs text-[#111111] outline-none placeholder:text-[#9CA3AF]"
                disabled={isSending}
              />
              <button
                type="submit"
                disabled={!input.trim() || isSending}
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#0B5D3B] text-white transition-opacity disabled:cursor-not-allowed disabled:opacity-40"
                title="Send message"
              >
                <Send className="h-4 w-4" />
              </button>
            </div>
            <p className="mt-1.5 px-1 text-[10px] text-[#9CA3AF]">
              General financial guidance, not regulated financial advice.
            </p>
          </form>
        </div>
      )}

      <button
        type="button"
        onClick={() => setIsOpen((open) => !open)}
        aria-label={isOpen ? 'Close FinTrack Assistant' : 'Open FinTrack Assistant'}
        className="fixed bottom-5 right-4 z-[55] flex h-12 w-12 items-center justify-center rounded-full bg-[#0B5D3B] text-white shadow-lg transition-transform hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0B5D3B] focus-visible:ring-offset-2 lg:right-6"
      >
        {isOpen ? <ChevronDown className="h-5 w-5" /> : <Bot className="h-5 w-5" />}
      </button>
    </>
  );
};
