using System;
using System.Windows.Input;

namespace app_movil.Components
{
    public partial class PrimaryButton : ContentView
    {
        public static readonly BindableProperty TextProperty =
            BindableProperty.Create(nameof(Text), typeof(string), typeof(PrimaryButton), string.Empty,
                propertyChanged: (b, o, n) => ((PrimaryButton)b).MainButton.Text = (string)n);

        public string Text
        {
            get => (string)GetValue(TextProperty);
            set => SetValue(TextProperty, value);
        }

        public static readonly BindableProperty CommandProperty =
            BindableProperty.Create(nameof(Command), typeof(ICommand), typeof(PrimaryButton), null,
                propertyChanged: (b, o, n) => ((PrimaryButton)b).MainButton.Command = (ICommand)n);

        public ICommand Command
        {
            get => (ICommand)GetValue(CommandProperty);
            set => SetValue(CommandProperty, value);
        }

        public static readonly BindableProperty CommandParameterProperty =
            BindableProperty.Create(nameof(CommandParameter), typeof(object), typeof(PrimaryButton), null,
                propertyChanged: (b, o, n) => ((PrimaryButton)b).MainButton.CommandParameter = n);

        public object CommandParameter
        {
            get => GetValue(CommandParameterProperty);
            set => SetValue(CommandParameterProperty, value);
        }

        public event EventHandler Clicked;

        public PrimaryButton()
        {
            InitializeComponent();
        }

        private void MainButton_Clicked(object sender, EventArgs e)
        {
            Clicked?.Invoke(this, e);
        }
    }
}