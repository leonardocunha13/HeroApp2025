import { View, Text } from '@aws-amplify/ui-react';

interface CardProps {
  title: string;
  description: string;
  footer?: React.ReactNode;
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

const Card: React.FC<CardProps> = ({ 
  title, 
  description, 
  footer, 
  children, 
  className, 
  style 
}) => {
  return (
    <View 
      className={`card ${className || ''}`} 
      style={{
        padding: '1rem',
        border: '1px solid #ccc',
        borderRadius: '8px',
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
        ...style,
      }}
    >
      <Text 
        as="h3" 
        style={{ marginBottom: '0.5rem', fontWeight: 'bold', fontSize: '1.25rem' }}
      >
        {title}
      </Text>
      <Text 
        as="p" 
        style={{ marginBottom: '1rem', color: '#555' }}
      >
        {description}
      </Text>
      <View style={{ marginBottom: '1rem' }}>
        {children}
      </View>
      {footer && (
        <View 
          style={{
            borderTop: '1px solid #eee',
            paddingTop: '0.5rem',
            marginTop: '1rem',
            color: '#777',
          }}
        >
          {footer}
        </View>
      )}
    </View>
  );
};

export default Card;