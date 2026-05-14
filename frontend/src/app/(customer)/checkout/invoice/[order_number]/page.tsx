'use client'
import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useAuthStore } from '@/stores/auth.store'
import { apiClient } from '@/lib/api-client'
import { QBPaymentForm } from '@/components/checkout/QBPaymentForm'

interface OrderItem {
  id: string
  product_name: string
  color: string | null
  size: string | null
  quantity: number
  unit_price: string
  line_total: string
}

interface OrderDetail {
  id: string
  order_number: string
  status: string
  payment_status: string
  subtotal: string
  shipping_cost: string
  tax_amount?: string
  total: string
  items: OrderItem[]
}

export default function InvoicePaymentPage() {
  const params = useParams()
  const router = useRouter()
  const orderNumber = (params.order_number as string).toUpperCase()
  const { isAuthenticated, isLoading } = useAuthStore()

  const [order, setOrder] = useState<OrderDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [paying, setPaying] = useState(false)
  const [paid, setPaid] = useState(false)

  useEffect(() => {
    if (!isLoading && !isAuthenticated()) {
      router.replace(`/login?redirect=/checkout/invoice/${orderNumber}`)
    }
  }, [isLoading, isAuthenticated, router, orderNumber])

  useEffect(() => {
    if (isLoading || !isAuthenticated()) return
    apiClient
      .get<OrderDetail>(`/api/v1/orders/${orderNumber}`)
      .then(data => {
        setOrder(data)
        if (data.payment_status === 'paid') setPaid(true)
      })
      .catch(() => setError('Order not found or you do not have access to this order.'))
      .finally(() => setLoading(false))
  }, [isLoading, orderNumber]) // eslint-disable-line react-hooks/exhaustive-deps

  async function handleToken(token: string) {
    if (!order) return
    setPaying(true)
    try {
      await apiClient.post(`/api/v1/orders/${order.id}/pay-invoice`, { card_token: token })
      setPaid(true)
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Payment failed. Please try again.')
      setPaying(false)
    }
  }

  if (isLoading || loading) {
    return (
      <div style={{ padding: '60px', textAlign: 'center', color: '#888', fontSize: '14px' }}>
        Loading invoice…
      </div>
    )
  }

  if (error && !paid) {
    return (
      <div style={{ maxWidth: '500px', margin: '60px auto', padding: '0 20px', textAlign: 'center' }}>
        <p style={{ color: '#E8242A', fontSize: '14px', marginBottom: '16px' }}>{error}</p>
        <button
          onClick={() => setError('')}
          style={{ marginRight: '10px', padding: '10px 20px', background: '#fff', color: '#1B3A5C', border: '1.5px solid #1B3A5C', borderRadius: '6px', cursor: 'pointer', fontSize: '13px', fontWeight: 600 }}
        >
          Try Again
        </button>
        <button
          onClick={() => router.push('/account/orders')}
          style={{ padding: '10px 20px', background: '#1B3A5C', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '13px', fontWeight: 600 }}
        >
          View My Orders
        </button>
      </div>
    )
  }

  if (!order) return null

  if (paid) {
    return (
      <div style={{ maxWidth: '500px', margin: '60px auto', padding: '0 20px', textAlign: 'center' }}>
        <div style={{ width: '64px', height: '64px', background: '#D1FAE5', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px', fontSize: '32px', color: '#065F46' }}>
          ✓
        </div>
        <h1 style={{ fontFamily: 'var(--font-bebas)', fontSize: '28px', color: '#1B3A5C', margin: '0 0 8px', letterSpacing: '.04em' }}>
          PAYMENT COMPLETE
        </h1>
        <p style={{ color: '#374151', fontSize: '14px', margin: '0 0 24px' }}>
          Thank you! Order {order.order_number} has been paid.
        </p>
        <button
          onClick={() => router.push('/account/orders')}
          style={{ padding: '12px 28px', background: '#1B3A5C', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '14px', fontWeight: 700 }}
        >
          View My Orders
        </button>
      </div>
    )
  }

  const shipping = Number(order.shipping_cost || 0)
  const tax = Number(order.tax_amount || 0)
  const total = Number(order.total)

  return (
    <div style={{ maxWidth: '560px', margin: '48px auto', padding: '0 20px' }}>
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: '28px' }}>
        <h1 style={{ fontFamily: 'var(--font-bebas)', fontSize: '30px', color: '#1B3A5C', margin: '0 0 6px', letterSpacing: '.04em' }}>
          PAY INVOICE
        </h1>
        <p style={{ color: '#888', fontSize: '13px', margin: 0 }}>Order {orderNumber}</p>
      </div>

      {/* Order summary */}
      <div style={{ background: '#f8f9fa', border: '1px solid #e5e7eb', borderRadius: '10px', padding: '18px 20px', marginBottom: '20px' }}>
        <p style={{ margin: '0 0 12px', fontSize: '11px', fontWeight: 700, color: '#888', textTransform: 'uppercase', letterSpacing: '.08em' }}>
          Order Summary
        </p>
        {order.items?.map((item, i) => (
          <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '7px 0', borderBottom: '1px solid #e5e7eb', fontSize: '13px' }}>
            <span style={{ color: '#374151' }}>
              {item.product_name} — {item.color ?? '—'}/{item.size ?? '—'} ×{item.quantity}
            </span>
            <span style={{ fontWeight: 600, color: '#111827', flexShrink: 0, marginLeft: '12px' }}>
              ${(Number(item.unit_price) * item.quantity).toFixed(2)}
            </span>
          </div>
        ))}
        <div style={{ display: 'flex', justifyContent: 'space-between', padding: '7px 0', fontSize: '13px', color: '#6b7280' }}>
          <span>Shipping</span>
          <span>${shipping.toFixed(2)}</span>
        </div>
        {tax > 0 && (
          <div style={{ display: 'flex', justifyContent: 'space-between', padding: '7px 0', fontSize: '13px', color: '#6b7280' }}>
            <span>Tax</span>
            <span>${tax.toFixed(2)}</span>
          </div>
        )}
        <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0 0', marginTop: '4px', borderTop: '2px solid #1B3A5C', fontSize: '17px', fontWeight: 800, color: '#1B3A5C' }}>
          <span>Total Due</span>
          <span style={{ color: '#E8242A' }}>${total.toFixed(2)}</span>
        </div>
      </div>

      {/* Payment form */}
      {paying ? (
        <div style={{ textAlign: 'center', padding: '40px', color: '#888', fontSize: '14px' }}>
          Processing payment…
        </div>
      ) : (
        <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: '10px', padding: '20px' }}>
          <p style={{ margin: '0 0 14px', fontSize: '11px', fontWeight: 700, color: '#888', textTransform: 'uppercase', letterSpacing: '.08em' }}>
            Card Details
          </p>
          <QBPaymentForm
            onToken={handleToken}
            onBack={() => router.push('/account/orders')}
            submitLabel={`Pay $${total.toFixed(2)}`}
          />
        </div>
      )}
    </div>
  )
}
