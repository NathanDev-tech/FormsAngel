import React, { Component, ErrorInfo, ReactNode } from 'react';
import { RefreshCw, AlertTriangle } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error caught by ErrorBoundary:', error, errorInfo);
  }

  public handleReload = () => {
    this.setState({ hasError: false, error: null });
    window.location.href = window.location.origin + window.location.pathname;
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-slate-900 text-white flex items-center justify-center p-6 font-sans">
          <div className="max-w-md w-full bg-slate-800/90 border border-amber-500/30 rounded-3xl p-8 text-center space-y-4 shadow-2xl backdrop-blur-md">
            <div className="w-14 h-14 rounded-2xl bg-amber-500/20 text-amber-400 mx-auto flex items-center justify-center">
              <AlertTriangle className="w-7 h-7" />
            </div>

            <div className="space-y-1">
              <h2 className="text-xl font-bold font-serif text-white">
                Cổng Thông Tin Ca Đoàn Thiên Thần
              </h2>
              <p className="text-xs text-slate-300 leading-relaxed">
                Đang làm mới dữ liệu ca đoàn. Vui lòng nhấn nút bên dưới để tải lại trang.
              </p>
            </div>

            <button
              type="button"
              onClick={this.handleReload}
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 font-bold text-xs shadow-lg hover:from-amber-300 hover:to-amber-400 transition-all cursor-pointer"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Tải Lại Trang Web</span>
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
