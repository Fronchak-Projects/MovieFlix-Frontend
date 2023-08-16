import ChangePasswordForm from '../../components/ChangePasswordForm';
import ProfileForm from '../../components/ProfileForm';

const Profile = () => {

  return (
    <div className="main-form-container flex-col md:flex-row gap-10 md:gap-2 items-center md:items-start">
      <div className="out-form-container max-w-lg">
        <div className="form-card-container">
          <ProfileForm />
        </div>
      </div>
      <div className="out-form-container max-w-lg">
        <div className="form-card-container">
          <ChangePasswordForm />
        </div>
      </div>
    </div>
  )
}

export default Profile;
