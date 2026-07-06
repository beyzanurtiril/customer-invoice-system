/*
  COMPONENT: FormField

  Form başlığı, input/select ve varsa yardım metnini ortak düzende gösterir.
  Gerçek input veya select `children` olarak bu componentin içine verilir.

  TASARIM: customers.css -> `.form-field`, `.form-field small`
*/

export default function FormField({ label, hint, children }) {
  return (
    <label className="form-field">
      <span>{label}</span>
      {children}
      {hint ? <small>{hint}</small> : null}
    </label>
  );
}
