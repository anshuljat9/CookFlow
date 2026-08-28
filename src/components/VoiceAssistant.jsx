import { Mic, MicOff, Loader2, Send, X, MessageSquare } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import Button from './Button';

const VOICE_COMMANDS = [
  'Next step',
  'Previous step',
  'Repeat step',
  'Read step',
  'Start timer 2 minutes',
  'Pause timer',
  'Resume timer',
  'How much garlic?',
  'How long for this step?',
];

export default function VoiceAssistant({
  isSupported,
  isListening,
  transcript,
  startListening,
  stopListening,
  onCommand,
  isEnabled,
  onToggleEnabled,
}) {
  const [showTextInput, setShowTextInput] = useState(false);
  const [textCommand, setTextCommand] = useState('');
  const [commandHistory, setCommandHistory] = useState([]);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [commandHistory]);

  const handleTextSubmit = (e) => {
    e.preventDefault();
    if (textCommand.trim()) {
      const cmd = textCommand.trim();
      setCommandHistory(prev => [...prev, { type: 'user', text: cmd, time: Date.now() }]);
      onCommand(cmd);
      setTextCommand('');
    }
  };

  const handleSuggestedCommand = (cmd) => {
    setCommandHistory(prev => [...prev, { type: 'user', text: cmd, time: Date.now() }]);
    onCommand(cmd);
  };

  if (!isSupported && !showTextInput) {
    return (
      <section className="card bg-charcoal-900 border-charcoal-800" aria-labelledby="voice-heading">
        <div className="p-4 lg:p-6">
          <h2 id="voice-heading" className="font-semibold mb-4 flex items-center gap-2">
            <MicOff className="h-5 w-5 text-charcoal-500" />
            Voice Assistant
          </h2>
          <p className="text-sm text-charcoal-400 mb-4">
            Voice recognition is not supported in this browser.
          </p>
          <Button
            variant="outline"
            leftIcon={<MessageSquare className="h-4 w-4" />}
            onClick={() => setShowTextInput(true)}
            className="w-full"
          >
            Use Text Commands Instead
          </Button>
        </div>
      </section>
    );
  }

  return (
    <section className="card bg-charcoal-900 border-charcoal-800" aria-labelledby="voice-heading">
      <div className="p-4 lg:p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 id="voice-heading" className="font-semibold flex items-center gap-2">
            <Mic className={`h-5 w-5 ${isEnabled ? 'text-primary-500' : 'text-charcoal-500'}`} />
            CookFlow Assistant
          </h2>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={isEnabled}
              onChange={onToggleEnabled}
              className="w-4 h-4 rounded text-primary-600 border-charcoal-600 focus:ring-primary-500 bg-charcoal-700"
            />
            <span className="text-sm text-charcoal-300">Enabled</span>
          </label>
        </div>

        {!showTextInput ? (
          <div>
            <Button
              variant={isEnabled && isListening ? 'danger' : isEnabled ? 'primary' : 'outline'}
              size="lg"
              className="w-full mb-3"
              leftIcon={isListening ? <Loader2 className="h-5 w-5 animate-spin" /> : <Mic className="h-5 w-5" />}
              onClick={isEnabled ? (isListening ? stopListening : startListening) : undefined}
              disabled={!isEnabled}
            >
              {isListening ? 'Listening...' : isEnabled ? 'Tap to Speak' : 'Enable Voice First'}
            </Button>

            {isListening && transcript && (
              <div className="mb-3 p-3 rounded-xl bg-charcoal-800">
                <p className="text-sm text-charcoal-300">Heard: <span className="text-white">"{transcript}"</span></p>
              </div>
            )}

            <p className="text-xs text-charcoal-400 mb-3">
              {isListening 
                ? 'Say a command...' 
                : isEnabled 
                  ? 'Try: "Next step", "Start timer 2 minutes", "How much garlic?"' 
                  : 'Enable voice to use commands'}
            </p>

            <div className="flex flex-wrap gap-2 mb-4">
              {VOICE_COMMANDS.slice(0, 4).map((cmd, i) => (
                <Button
                  key={i}
                  variant="ghost"
                  size="sm"
                  onClick={() => handleSuggestedCommand(cmd)}
                  disabled={!isEnabled}
                  className="text-xs"
                >
                  {cmd}
                </Button>
              ))}
            </div>

            <Button
              variant="ghost"
              size="sm"
              leftIcon={<MessageSquare className="h-4 w-4" />}
              onClick={() => setShowTextInput(true)}
              className="w-full"
            >
              Type Command Instead
            </Button>
          </div>
        ) : (
          <div>
            <div className="max-h-64 overflow-y-auto mb-4 space-y-3" ref={messagesEndRef}>
              {commandHistory.map((msg, i) => (
                <div key={i} className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[80%] px-3 py-2 rounded-2xl ${msg.type === 'user' ? 'bg-primary-600 text-white rounded-br-none' : 'bg-charcoal-800 text-white rounded-bl-none'}`}>
                    <p className="text-sm">{msg.text}</p>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            <form onSubmit={handleTextSubmit} className="flex gap-2">
              <input
                type="text"
                value={textCommand}
                onChange={(e) => setTextCommand(e.target.value)}
                placeholder="Type a command..."
                className="flex-1 input bg-charcoal-800 text-white placeholder-charcoal-400"
                autoFocus
              />
              <Button type="submit" leftIcon={<Send className="h-4 w-4" />} disabled={!textCommand.trim()}>
                Send
              </Button>
              <Button variant="ghost" size="icon" onClick={() => setShowTextInput(false)}>
                <X className="h-4 w-4" />
              </Button>
            </form>
          </div>
        )}
      </div>
    </section>
  );
}