interface SettingOptionProps {
  title: string;
  description: string;
  children: React.ReactNode;
}

function SettingOption({ title, description, children }: SettingOptionProps) {
  return (
    <div>
      <p className="text-2xl">{title}</p>
      <div className="grid grid-cols-2">
        <p className="flex items-center">{description}</p>
        {children}
      </div>
      <hr className="mt-6 border-neutral-700" />
    </div>
  );
}

export default SettingOption;
