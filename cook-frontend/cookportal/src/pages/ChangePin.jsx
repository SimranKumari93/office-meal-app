import React, { useState } from 'react';
import axios from 'axios';

export default function ChangePin({ onBack }) {
  const [oldPin, setOldPin] = useState('');
  const [newPin, setNewPin] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);

  const submit = async (e) => {
    e && e.preventDefault();
    setMessage(null);
    if (!/^[0-9]{4}$/.test(newPin)) {
      setMessage({ type: 'error', text: 'New PIN must be exactly 4 digits.' });
      return;
    }
    setLoading(true);
    try {
      const res = await axios.post('http://127.0.0.1:8000/api/change-pin/', { old_pin: oldPin, new_pin: newPin });
      setMessage({ type: 'success', text: res.data?.message || 'PIN changed successfully. You may need to login again.' });
      // after change, force logout by clearing token so user can login with new PIN
      setTimeout(() => {
        // optional: redirect back
        onBack && onBack();
      }, 1200);
    } catch (err) {
      setMessage({ type: 'error', text: err?.response?.data?.error || 'Change failed' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-wrapper" style={{display:'flex',alignItems:'center',justifyContent:'center',minHeight:'70vh',padding:16}}>
      <div className="card" style={{maxWidth:480,width:'100%'}}>
        <h3 style={{marginTop:0,textAlign:'center'}}>Change PIN</h3>
        <p style={{textAlign:'center'}}>Enter your current PIN and a new 4-digit PIN.</p>
        <form onSubmit={submit}>
          <input className="input" placeholder="Current PIN" type="password" value={oldPin} onChange={e=>setOldPin(e.target.value.replace(/\D/g,'').slice(0,4))} required />
          <input className="input" placeholder="New 4-digit PIN" value={newPin} onChange={e=>setNewPin(e.target.value.replace(/\D/g,'').slice(0,4))} required />
          <div style={{display:'flex',gap:8,marginTop:10}}>
            <button className="btn" type="submit" disabled={loading}>{loading? 'Saving...':'Change PIN'}</button>
            <button type="button" className="btn ghost" onClick={()=>onBack && onBack()}>Back</button>
          </div>
        </form>

        {message && (
          <div style={{marginTop:12,color: message.type==='error'? 'crimson':'green'}}>{message.text}</div>
        )}
      </div>
    </div>
  );
}
