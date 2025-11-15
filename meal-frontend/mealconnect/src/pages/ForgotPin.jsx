import React, { useState } from 'react';
import axios from 'axios';

export default function ForgotPin({ onBack }) {
  const [employeeId, setEmployeeId] = useState('');
  const [name, setName] = useState('');
  const [newPin, setNewPin] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);

  const submit = async (e) => {
    e && e.preventDefault();
    setLoading(true);
    setMessage(null);
    if (!/^[0-9]{4}$/.test(newPin)) {
      setMessage({ type: 'error', text: 'PIN must be exactly 4 digits.' });
      setLoading(false);
      return;
    }

    try {
      const res = await axios.post('http://127.0.0.1:8000/forgot-pin/', { employee_id: employeeId, name, new_pin: newPin });
      setMessage({ type: 'success', text: res.data?.message || 'PIN reset successful.' });
      // optionally redirect back to login
      setTimeout(() => {
        onBack && onBack();
      }, 1200);
    } catch (err) {
      setMessage({ type: 'error', text: err?.response?.data?.error || 'Reset failed' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-wrapper" style={{display:'flex',alignItems:'center',justifyContent:'center',minHeight:'70vh',padding:16}}>
      <div className="card" style={{maxWidth:480,width:'100%'}}>
        <h3 style={{marginTop:0,textAlign:'center'}}>Forgot PIN</h3>
        {/* <p>Enter your Employee ID and full name to reset your 4-digit PIN.</p> */}
        <form onSubmit={submit}>
          <input className="input" placeholder="Employee ID" value={employeeId} onChange={e=>setEmployeeId(e.target.value)} required />
          <input className="input" placeholder="Full Name" value={name} onChange={e=>setName(e.target.value)} required />
          <input className="input" placeholder="New 4-digit PIN" value={newPin} onChange={e=>setNewPin(e.target.value.replace(/\D/g,'').slice(0,4))} required />
          <div style={{display:'flex',gap:8,marginTop:10}}>
            <button className="btn" type="submit" disabled={loading}>{loading? 'Saving...':'Reset PIN'}</button>
            <button type="button" className="btn ghost" onClick={()=>onBack && onBack()}>Back to login</button>
          </div>
        </form>

        {message && (
          <div style={{marginTop:12,color: message.type==='error'? 'crimson':'green'}}>{message.text}</div>
        )}
      </div>
    </div>
  );
}
