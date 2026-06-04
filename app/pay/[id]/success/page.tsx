export default function PaymentSuccessPage() {
  return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: '#F7F9FC', fontFamily: 'Inter, sans-serif' }}>
      <div className="text-center">
        <div className="text-3xl font-extrabold tracking-tight mb-2" style={{ color: '#0A0F1E', letterSpacing: '-0.04em' }}>
          <span style={{ color: '#0099BB' }}>x</span>ynco
        </div>
        <div className="w-12 h-12 rounded-full flex items-center justify-center mx-auto my-6" style={{ background: '#10B981' }}>
          <span className="text-white text-2xl">✓</span>
        </div>
        <div className="text-xl font-bold mb-2" style={{ color: '#0A0F1E' }}>Payment received</div>
        <div className="text-sm" style={{ color: '#6B7280' }}>Thank you. A receipt has been sent to your email.</div>
      </div>
    </div>
  )
}
