import { useNavigate } from 'react-router-dom';
import Button from '../components/common/Button';
import { FiHome } from 'react-icons/fi';

export default function NotFound() {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-gradient-to-br from-primary-50 via-accent-50 to-purple-100 
                    flex items-center justify-center p-4">
            <div className="text-center animate-scale-in">
                <div className="mb-8">
                    <h1 className="text-9xl font-bold text-gradient mb-4">404</h1>
                    <h2 className="text-3xl font-bold text-slate-800 mb-2">Page Not Found</h2>
                    <p className="text-slate-600 text-lg">
                        The page you are looking for doesn't exist.
                    </p>
                </div>
                <Button
                    variant="primary"
                    icon={FiHome}
                    onClick={() => navigate('/dashboard')}
                >
                    Go to Dashboard
                </Button>
            </div>
        </div>
    );
}
