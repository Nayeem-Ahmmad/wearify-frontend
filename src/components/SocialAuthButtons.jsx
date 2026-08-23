import { useEffect } from 'react'
import { useGoogleLogin } from '@react-oauth/google'
import { FcGoogle } from 'react-icons/fc'
import { FaFacebook } from 'react-icons/fa'
import axios from 'axios'

const API_BASE = 'https://wearify-backend-4bqg.onrender.com'
const FACEBOOK_APP_ID = '1710670040007958'

const loadFacebookSdk = () => {
  return new Promise((resolve) => {
    if (window.FB) {
      resolve(window.FB)
      return
    }
    window.fbAsyncInit = function () {
      window.FB.init({
        appId: FACEBOOK_APP_ID,
        cookie: true,
        xfbml: false,
        version: 'v20.0',
      })
      resolve(window.FB)
    }
    const script = document.createElement('script')
    script.src = 'https://connect.facebook.net/en_US/sdk.js'
    script.async = true
    script.defer = true
    document.body.appendChild(script)
  })
}

const SocialAuthButtons = ({ redirectTo = '/' }) => {
  useEffect(() => {
    loadFacebookSdk()
  }, [])

  const handleSocialSuccess = (access, refresh) => {
    localStorage.setItem('access', access)
    localStorage.setItem('refresh', refresh)
    window.location.href = redirectTo
  }

  const googleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        const res = await axios.post(`${API_BASE}/api/auth/google/`, {
          access_token: tokenResponse.access_token,
        })
        handleSocialSuccess(res.data.access, res.data.refresh)
      } catch (err) {
        console.error('Google login failed:', err)
      }
    },
    onError: () => console.error('Google login failed'),
  })

  const handleFacebookLogin = async () => {
    const FB = await loadFacebookSdk()
    FB.login(
      async (response) => {
        if (response.authResponse) {
          try {
            const res = await axios.post(`${API_BASE}/api/auth/facebook/`, {
              access_token: response.authResponse.accessToken,
            })
            handleSocialSuccess(res.data.access, res.data.refresh)
          } catch (err) {
            console.error('Facebook login failed:', err)
          }
        }
      },
      { scope: 'email,public_profile' }
    )
  }

  return (
    <div className="mt-6">
      <div className="flex items-center gap-3">
        <div className="flex-1 h-px bg-slate-200" />
        <span className="text-xs text-slate-400 font-medium">OR CONTINUE WITH</span>
        <div className="flex-1 h-px bg-slate-200" />
      </div>

      <div className="grid grid-cols-2 gap-3 mt-5">
        <button
          type="button"
          onClick={() => googleLogin()}
          className="flex items-center justify-center gap-2 py-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 hover:border-slate-300 transition-all duration-300 text-sm font-medium text-slate-700"
        >
          <FcGoogle size={18} />
          Google
        </button>

        <button
          type="button"
          onClick={handleFacebookLogin}
          className="flex items-center justify-center gap-2 py-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 hover:border-slate-300 transition-all duration-300 text-sm font-medium text-[#1877F2]"
        >
          <FaFacebook size={18} />
          Facebook
        </button>
      </div>
    </div>
  )
}

export default SocialAuthButtons