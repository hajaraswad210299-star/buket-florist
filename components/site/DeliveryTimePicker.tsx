"use client";
import { useId, useRef, useState } from "react";
import { IconCalendar } from "./icons";
import styles from "./DeliveryTimePicker.module.css";

// Delivery times are interpreted in the shop's timezone, independent of the device.
function jakartaNow() {
 const parts = new Intl.DateTimeFormat("en-CA", { timeZone:"Asia/Jakarta", year:"numeric", month:"2-digit", day:"2-digit", hour:"2-digit", minute:"2-digit", hourCycle:"h23" }).formatToParts(new Date());
 const part = (type:string) => parts.find(p=>p.type===type)?.value ?? "";
 return `${part("year")}-${part("month")}-${part("day")}T${part("hour")}:${part("minute")}`;
}
function dateLabel(date:string) { return new Intl.DateTimeFormat("id-ID", {day:"numeric",month:"long",year:"numeric",timeZone:"UTC"}).format(new Date(`${date}T00:00:00Z`)); }
export default function DeliveryTimePicker({ value, onChange }: {value:string;onChange:(value:string)=>void}) {
 const [open,setOpen]=useState(false);
 const [month,setMonth]=useState("");
 const [date,setDate]=useState("");
 const [time,setTime]=useState("09:00");
 const [error,setError]=useState("");
 const trigger=useRef<HTMLButtonElement>(null);
 const id=useId();
 const [year,monthNumber]=month.split("-").map(Number);
 const days=month ? new Date(Date.UTC(year,monthNumber,0)).getUTCDate() : 0;
 const offset=month ? (new Date(`${month}-01T00:00:00Z`).getUTCDay()+6)%7 : 0;
 const now=open ? jakartaNow() : "";
 const today=now.slice(0,10);
 function show() {
  const current=jakartaNow(); const selected=value.slice(0,10)||current.slice(0,10);
  setDate(selected);setMonth(selected.slice(0,7));setTime(value.slice(11)||"09:00");setError("");setOpen(true);
 }
 function close() {setOpen(false);trigger.current?.focus();}
 function moveMonth(delta:number) {
  const next=new Date(Date.UTC(year,monthNumber-1+delta,1));setMonth(next.toISOString().slice(0,7));
 }
 function apply() {
  if (!date || !time || `${date}T${time}`<=jakartaNow()) {setError("Pilih tanggal dan jam yang belum lewat (WIB).");return;}
  onChange(`${date}T${time}`);close();
 }
 return <div className={styles.root} onKeyDown={event=>{if(open&&event.key==="Escape"){event.preventDefault();event.stopPropagation();close();}}}>
  <button ref={trigger} type="button" className={styles.trigger} aria-expanded={open} aria-controls={id} onClick={()=>open?close():show()}><span>{value ? `${dateLabel(value.slice(0,10))}, ${value.slice(11)} WIB` : "Pilih Waktu Pengantaran."}</span><IconCalendar className="size-[18px] shrink-0 text-[#7a70ba]" /></button>
  {open && <div id={id} className={styles.panel} role="group" aria-label="Tanggal dan jam pengantaran">
   <div className={styles.month}><button type="button" aria-label="Bulan sebelumnya" disabled={month<=today.slice(0,7)} onClick={()=>moveMonth(-1)}>‹</button><p aria-live="polite">{new Intl.DateTimeFormat("id-ID",{month:"long",year:"numeric",timeZone:"UTC"}).format(new Date(`${month}-01T00:00:00Z`))}</p><button type="button" aria-label="Bulan berikutnya" onClick={()=>moveMonth(1)}>›</button></div>
   <div className={styles.calendar}>{["Sen","Sel","Rab","Kam","Jum","Sab","Min"].map(day=><span className={styles.weekday} key={day}>{day}</span>)}{Array.from({length:offset},(_,index)=><span key={`empty-${index}`} />)}{Array.from({length:days},(_,index)=>{
    const day=`${month}-${String(index+1).padStart(2,"0")}`;
    return <button type="button" key={day} disabled={day<today} aria-label={dateLabel(day)} aria-pressed={date===day} aria-current={day===today?"date":undefined} onClick={()=>{setDate(day);setError("");}}>{index+1}</button>;
   })}</div>
   <fieldset className={styles.time}><legend>Jam pengantaran (WIB)</legend><div className={styles.timeFields}><select aria-label="Jam" value={time.slice(0,2)} onChange={event=>{setTime(`${event.target.value}:${time.slice(3)}`);setError("");}}>{Array.from({length:24},(_,index)=>String(index).padStart(2,"0")).map(hour=><option key={hour}>{hour}</option>)}</select><span>:</span><select aria-label="Menit" value={time.slice(3)} onChange={event=>{setTime(`${time.slice(0,2)}:${event.target.value}`);setError("");}}>{Array.from({length:60},(_,index)=>String(index).padStart(2,"0")).map(minute=><option key={minute}>{minute}</option>)}</select></div></fieldset>
   <p className={styles.hint}>Pilih waktu yang diinginkan. Ketersediaan dikonfirmasi oleh toko.</p>
   {error&&<p role="alert" className={styles.error}>{error}</p>}
   <div className={styles.actions}><button type="button" onClick={close}>Batal</button><button type="button" onClick={apply}>Pilih waktu</button></div>
  </div>}
 </div>;
}
