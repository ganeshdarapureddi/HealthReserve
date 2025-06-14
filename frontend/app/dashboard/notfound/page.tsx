export default function NotFound() {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        flexDirection: 'column',
        fontFamily: 'Arial, sans-serif'
      }}>
        <h1 style={{ fontSize: '2rem', color: '#cc0000' }}>No access to this page</h1>
        <p style={{ color: '#555' }}>You might not have the required permissions or the page doesnt exist.</p>
      </div>
    );
  }
  