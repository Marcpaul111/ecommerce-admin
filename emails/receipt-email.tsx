import {
    Body,
    Container,
    Head,
    Heading,
    Hr,
    Html,
    Link,
    Preview,
    Section,
    Text,
  } from '@react-email/components';
  import { format } from 'date-fns';
  
  interface ReceiptEmailProps {
    email: string;
    date: Date;
    orderNumber: string;
    products: Array<{
      name: string;
      quantity: number;
      price: number;
    }>;
    totalAmount: number;
    receiptUrl: string;
  }
  
  export default function ReceiptEmail({
    email,
    date,
    orderNumber,
    products,
    totalAmount,
    receiptUrl,
  }: ReceiptEmailProps) {
    return (
      <Html>
        <Head />
        <Preview>Your purchase receipt</Preview>
        <Body style={main}>
          <Container style={container}>
            <Heading style={h1}>Receipt from Your Store</Heading>
            <Text style={text}>Hi {email},</Text>
            <Text style={text}>
              This email confirms your purchase on {format(date, 'MMMM do, yyyy')}.
            </Text>
  
            <Section style={section}>
              <Text style={h2}>Order Summary</Text>
              {products.map((product) => (
                <Text key={product.name} style={productText}>
                  {product.quantity}x {product.name} - ${product.price.toFixed(2)}
                </Text>
              ))}
              <Hr style={hr} />
              <Text style={total}>Total: ${totalAmount.toFixed(2)}</Text>
            </Section>
  
            <Section style={section}>
              <Text style={text}>
                Order number: <span style={orderNumberStyle}>{orderNumber}</span>
              </Text>
            </Section>
  
            <Section style={section}>
              <Link style={button} href={receiptUrl}>
                View detailed receipt
              </Link>
            </Section>
  
            <Text style={footer}>
              If you have any questions, please don't hesitate to contact us.
            </Text>
          </Container>
        </Body>
      </Html>
    );
  }
  
  const main = {
    backgroundColor: '#ffffff',
    fontFamily:
      '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif',
  };
  
  const container = {
    margin: '0 auto',
    padding: '20px 0 48px',
    maxWidth: '560px',
  };
  
  const h1 = {
    color: '#333',
    fontSize: '24px',
    fontWeight: '600',
    lineHeight: '1.25',
    marginBottom: '24px',
  };
  
  const h2 = {
    color: '#444',
    fontSize: '20px',
    fontWeight: '600',
    lineHeight: '1.25',
    marginBottom: '16px',
  };
  
  const text = {
    color: '#555',
    fontSize: '16px',
    lineHeight: '1.5',
    marginBottom: '12px',
  };
  
  const productText = {
    color: '#555',
    fontSize: '14px',
    lineHeight: '1.5',
    marginBottom: '8px',
  };
  
  const section = {
    marginBottom: '24px',
  };
  
  const button = {
    backgroundColor: '#000',
    borderRadius: '4px',
    color: '#fff',
    display: 'inline-block',
    fontSize: '16px',
    fontWeight: '600',
    lineHeight: '1.5',
    padding: '12px 24px',
    textDecoration: 'none',
    textAlign: 'center' as const,
  };
  
  const hr = {
    borderColor: '#ddd',
    marginVertical: '16px',
  };
  
  const total = {
    color: '#111',
    fontSize: '18px',
    fontWeight: '600',
    marginTop: '8px',
  };
  
  const orderNumberStyle = {
    color: '#000',
    fontWeight: '600',
  };
  
  const footer = {
    color: '#777',
    fontSize: '14px',
    fontStyle: 'italic',
    marginTop: '32px',
  };