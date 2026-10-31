import React, { useState } from 'react';
import { X, Send, HelpCircle, MessageSquare, Plus, Clock } from 'lucide-react';
import { SupportTicket } from '../../types/watch';
import { StoreService } from '../../services/storeService';

interface SupportTicketModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SupportTicketModal: React.FC<SupportTicketModalProps> = ({ isOpen, onClose }) => {
  const [view, setView] = useState<'list' | 'create' | 'thread'>('list');
  const [selectedTicket, setSelectedTicket] = useState<SupportTicket | null>(null);

  // New ticket form
  const [name, setName] = useState('Sanket Vedpathak');
  const [email, setEmail] = useState('sanketvedpathak7@gmail.com');
  const [orderNumber, setOrderNumber] = useState('');
  const [category, setCategory] = useState<SupportTicket['category']>('Delivery Delay');
  const [priority, setPriority] = useState<SupportTicket['priority']>('Medium');
  const [message, setMessage] = useState('');

  // Reply message
  const [replyText, setReplyText] = useState('');

  if (!isOpen) return null;

  const tickets = StoreService.getTickets();

  const handleCreateTicket = (e: React.FormEvent) => {
    e.preventDefault();
    const newTicketNum = `TKT-AUR-${Math.floor(400 + Math.random() * 500)}`;
    const newTicket: SupportTicket = {
      id: `tkt-${Date.now()}`,
      ticketNumber: newTicketNum,
      customerName: name,
      customerEmail: email,
      orderNumber,
      category,
      priority,
      status: 'Open',
      assignedAgent: 'Support Concierge Team',
      createdAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
      updatedAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
      messages: [
        {
          id: `msg-${Date.now()}`,
          sender: 'customer',
          senderName: name,
          text: message,
          timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16)
        }
      ]
    };

    StoreService.createTicket(newTicket);
    setSelectedTicket(newTicket);
    setView('thread');
    setMessage('');
  };

  const handleSendReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTicket || !replyText.trim()) return;

    const newMsg = {
      id: `msg-${Date.now()}`,
      sender: 'customer' as const,
      senderName: name,
      text: replyText.trim(),
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16)
    };

    StoreService.addTicketMessage(selectedTicket.id, newMsg);
    selectedTicket.messages.push(newMsg);
    setReplyText('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-[#FFFFFF] border border-[#E8E2D7] rounded-2xl shadow-2xl p-6 sm:p-8 text-left max-h-[90vh] flex flex-col justify-between">
        {/* Top Header */}
        <div className="flex items-center justify-between border-b border-[#E8E2D7] pb-4">
          <div>
            <span className="text-xs font-semibold tracking-widest uppercase text-[#C6A66B]">
              AURRA Client Concierge
            </span>
            <h2 className="text-xl font-serif text-[#111111]">Customer Support Desk</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-[#777777] hover:text-[#111111] hover:bg-[#F7F4EE] rounded-md transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* View Switcher Bar */}
        <div className="py-3 flex items-center justify-between border-b border-[#E8E2D7] text-xs">
          <div className="flex gap-2">
            <button
              onClick={() => setView('list')}
              className={`px-3 py-1 rounded transition-colors cursor-pointer ${
                view === 'list' ? 'bg-[#111111] text-white font-medium' : 'text-[#777777] hover:text-[#111111]'
              }`}
            >
              My Tickets ({tickets.length})
            </button>
            <button
              onClick={() => setView('create')}
              className={`px-3 py-1 rounded transition-colors cursor-pointer flex items-center gap-1 ${
                view === 'create' ? 'bg-[#111111] text-white font-medium' : 'text-[#777777] hover:text-[#111111]'
              }`}
            >
              <Plus className="w-3 h-3 text-[#C6A66B]" />
              <span>Raise Ticket</span>
            </button>
          </div>

          <span className="text-[11px] text-[#777777]">Avg. First Response: &lt; 2 hours</span>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto py-4">
          {/* VIEW 1: Tickets List */}
          {view === 'list' && (
            <div className="space-y-3">
              {tickets.map((tkt) => (
                <div
                  key={tkt.id}
                  onClick={() => {
                    setSelectedTicket(tkt);
                    setView('thread');
                  }}
                  className="p-4 bg-[#F7F4EE] border border-[#E8E2D7] hover:border-[#111111] rounded-xl transition-all cursor-pointer space-y-1.5 text-xs text-left shadow-xs"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-[#111111]">
                      {tkt.ticketNumber} · {tkt.category}
                    </span>
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-medium ${
                        tkt.status === 'Resolved'
                          ? 'bg-emerald-50 text-emerald-800 border border-emerald-300'
                          : tkt.status === 'In Progress'
                          ? 'bg-amber-50 text-amber-800 border border-amber-300'
                          : 'bg-blue-50 text-blue-800 border border-blue-300'
                      }`}
                    >
                      {tkt.status}
                    </span>
                  </div>

                  <p className="text-[#555555] line-clamp-1">
                    {tkt.messages[tkt.messages.length - 1]?.text || 'No messages'}
                  </p>

                  <div className="flex items-center justify-between pt-1 text-[11px] text-[#777777]">
                    <span>Agent: {tkt.assignedAgent || 'Concierge Queue'}</span>
                    <span>Updated: {tkt.updatedAt}</span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* VIEW 2: Create Ticket */}
          {view === 'create' && (
            <form onSubmit={handleCreateTicket} className="space-y-3.5 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[#111111] font-medium mb-1">Full Name</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-[#F7F4EE] border border-[#E8E2D7] rounded px-3 py-2 text-[#171717] focus:bg-[#FFFFFF]"
                  />
                </div>
                <div>
                  <label className="block text-[#111111] font-medium mb-1">Email</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-[#F7F4EE] border border-[#E8E2D7] rounded px-3 py-2 text-[#171717] focus:bg-[#FFFFFF]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-[#111111] font-medium mb-1">Order # (if applicable)</label>
                  <input
                    type="text"
                    placeholder="e.g. AUR-8941"
                    value={orderNumber}
                    onChange={(e) => setOrderNumber(e.target.value)}
                    className="w-full bg-[#F7F4EE] border border-[#E8E2D7] rounded px-3 py-2 text-[#171717] focus:bg-[#FFFFFF]"
                  />
                </div>
                <div>
                  <label className="block text-[#111111] font-medium mb-1">Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as any)}
                    className="w-full bg-[#F7F4EE] border border-[#E8E2D7] rounded px-3 py-2 text-[#171717] focus:bg-[#FFFFFF]"
                  >
                    <option value="Delivery Delay">Delivery Delay</option>
                    <option value="Product Issue / Defect">Product Issue / Defect</option>
                    <option value="Warranty Claim">Warranty Claim</option>
                    <option value="Return Request">Return Request</option>
                    <option value="Payment Query">Payment Query</option>
                    <option value="General Question">General Question</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[#111111] font-medium mb-1">Priority</label>
                  <select
                    value={priority}
                    onChange={(e) => setPriority(e.target.value as any)}
                    className="w-full bg-[#F7F4EE] border border-[#E8E2D7] rounded px-3 py-2 text-[#171717] focus:bg-[#FFFFFF]"
                  >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                    <option value="Urgent">Urgent</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[#111111] font-medium mb-1">Description of Issue</label>
                <textarea
                  rows={4}
                  required
                  placeholder="Provide complete details to help us resolve this promptly..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full bg-[#F7F4EE] border border-[#E8E2D7] rounded px-3 py-2 text-[#171717] focus:bg-[#FFFFFF]"
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setView('list')}
                  className="px-4 py-2 text-[#777777] hover:text-[#111111]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-[#111111] hover:bg-[#303030] text-white font-semibold rounded cursor-pointer shadow-xs transition-colors"
                >
                  Submit Ticket
                </button>
              </div>
            </form>
          )}

          {/* VIEW 3: Active Thread Chat */}
          {view === 'thread' && selectedTicket && (
            <div className="space-y-4 text-xs">
              <div className="p-3 bg-[#F7F4EE] rounded-lg border border-[#E8E2D7] flex justify-between items-center">
                <div>
                  <span className="font-semibold text-[#111111]">{selectedTicket.ticketNumber}</span>
                  <span className="text-[#777777] ml-2">{selectedTicket.category}</span>
                </div>
                <span className="text-[11px] text-[#111111] bg-[#FFFFFF] px-2 py-0.5 rounded border border-[#E8E2D7] font-medium">
                  {selectedTicket.status}
                </span>
              </div>

              {/* Messages container */}
              <div className="space-y-3 max-h-60 overflow-y-auto p-1">
                {selectedTicket.messages
                  .filter((m) => !m.isInternalNote) // hide internal agent notes from customer view
                  .map((msg) => (
                    <div
                      key={msg.id}
                      className={`p-3 rounded-xl max-w-[85%] ${
                        msg.sender === 'customer'
                          ? 'ml-auto bg-[#F7F4EE] border border-[#E8E2D7] text-[#171717]'
                          : 'mr-auto bg-[#FFFFFF] border border-[#E8E2D7] text-[#171717] shadow-xs'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-4 text-[10px] text-[#777777] mb-1">
                        <span className="font-semibold text-[#111111]">{msg.senderName}</span>
                        <span>{msg.timestamp}</span>
                      </div>
                      <p className="leading-relaxed">{msg.text}</p>
                    </div>
                  ))}
              </div>

              {/* Reply Form */}
              <form onSubmit={handleSendReply} className="flex gap-2 pt-2">
                <input
                  type="text"
                  placeholder="Type your reply to our concierge..."
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  className="flex-1 bg-[#F7F4EE] border border-[#E8E2D7] rounded px-3 py-2 text-[#171717] focus:outline-none focus:border-[#C6A66B] focus:bg-[#FFFFFF]"
                />
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#111111] hover:bg-[#303030] text-white font-semibold rounded cursor-pointer flex items-center gap-1 shadow-xs transition-colors"
                >
                  <Send className="w-3.5 h-3.5 text-[#C6A66B]" />
                  <span>Send</span>
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
