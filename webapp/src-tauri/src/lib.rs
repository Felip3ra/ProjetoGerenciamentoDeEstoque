#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
  use std::collections::HashMap;
  use std::env;
  use std::path::PathBuf;
  use std::process::{Child, Command, Stdio};
  use std::sync::Mutex;
  use tauri::path::BaseDirectory;
  use tauri::{Manager, RunEvent};

  struct SidecarState(Mutex<Option<Child>>);

  fn resolve_sidecar_path(app: &tauri::AppHandle) -> tauri::Result<PathBuf> {
    #[cfg(debug_assertions)]
    {
      let exe_dir = env::current_exe()?
        .parent()
        .and_then(|dir| dir.parent())
        .and_then(|dir| dir.parent())
        .and_then(|dir| dir.parent())
        .map(|dir| dir.to_path_buf())
        .unwrap_or_else(|| env::current_dir().unwrap_or_default());
      let exe_path = exe_dir
        .join(".sidecar")
        .join("ProjetoGerenciamentoEstoque.Presentation.exe");
      if exe_path.exists() {
        return Ok(exe_path);
      }

      return Ok(
        env::current_dir()
          .unwrap_or_default()
          .join(".sidecar")
          .join("ProjetoGerenciamentoEstoque.Presentation.exe"),
      );
    }

    #[cfg(not(debug_assertions))]
    {
      let resolver = app.path();
      resolver
        .resolve(
          "bin/ProjetoGerenciamentoEstoque.Presentation-x86_64-pc-windows-msvc.exe",
          BaseDirectory::Resource,
        )
        .or_else(|_| {
          resolver.resolve(
            "bin/ProjetoGerenciamentoEstoque.Presentation.exe",
            BaseDirectory::Resource,
          )
        })
    }
  }

  fn start_sidecar(app: &tauri::AppHandle) -> tauri::Result<Child> {
    let exe_path = resolve_sidecar_path(app)?;
    let exe_dir = exe_path
      .parent()
      .map(|dir| dir.to_path_buf())
      .unwrap_or_else(|| env::current_dir().unwrap_or_default());

    let mut envs = HashMap::new();
    envs.insert(
      "ASPNETCORE_ENVIRONMENT".to_string(),
      "Development".to_string(),
    );
    envs.insert(
      "Logging__LogLevel__Default".to_string(),
      "Warning".to_string(),
    );
    envs.insert(
      "Logging__LogLevel__Microsoft".to_string(),
      "Warning".to_string(),
    );
    envs.insert(
      "Logging__LogLevel__Microsoft.Hosting.Lifetime".to_string(),
      "Warning".to_string(),
    );

    Command::new(&exe_path)
      .current_dir(exe_dir)
      .args(["--urls", "https://localhost:7066"])
      .envs(envs)
      .stdout(Stdio::inherit())
      .stderr(Stdio::inherit())
      .spawn()
      .map_err(Into::into)
  }

  fn stop_sidecar(app: &tauri::AppHandle) {
    if let Some(state) = app.try_state::<SidecarState>() {
      if let Ok(mut guard) = state.0.lock() {
        if let Some(mut child) = guard.take() {
          let _ = child.kill();
          let _ = child.wait();
        }
      }
    }
  }

  tauri::Builder::default()
    .setup(|app| {
      if cfg!(debug_assertions) {
        app.handle().plugin(
          tauri_plugin_log::Builder::default()
            .level(log::LevelFilter::Info)
            .build(),
        )?;
      }

      let child = start_sidecar(app.handle())?;
      app.manage(SidecarState(Mutex::new(Some(child))));
      Ok(())
    })
    .build(tauri::generate_context!())
    .expect("error while building tauri application")
    .run(|app_handle, event| match event {
      RunEvent::ExitRequested { .. } => {
        stop_sidecar(app_handle);
      }
      RunEvent::WindowEvent { event, .. } => {
        if matches!(event, tauri::WindowEvent::CloseRequested { .. }) {
          stop_sidecar(app_handle);
        }
      }
      _ => {}
    });
}
