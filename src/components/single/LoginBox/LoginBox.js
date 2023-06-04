import css from './LoginBox.module.css';
import TextField from '../../reusable/TextField/TextField'

export default function LoginBox({ className }) {
  return (
    <div className={[LoginBox.name, css.root, className].join(' ')}>
      <div className={[css.pane, css.left].join(' ')}>
        <img style={{width: '35%', marginBottom: '1em'}} src="https://www.kindpng.com/picc/b/30-305993_buzz-png.png" alt="Buzz Georgia Tech Logo Clipart , Png Download - Buzz Georgia Tech Png, Transparent Png@kindpng.com"/>
        <div className={css.loginBenefits}>
          <div className={css.heading}>
            Log in or create an account to access advanced features
          </div>
          <div className={css.detail}>
            <li>Sync plans across devices</li>
            <li>Evaluate and filter by prerequisites</li>
            <li>Track degree requirements and completion</li>
          </div>
        </div>
      </div>
      <div className={[css.pane, css.right].join(' ')}>
        <div className={css.login}>
          <TextField className={css.email} defaultText={'Email address'} />
          <TextField className={css.password} defaultText={'Password'} isPassword={true} />
          <button className={css.submit}>Login</button>
        </div>
      </div>
    </div>
  )
}