provider "google" {
  project     = "my-first-project-388722"
  region      = "us-central1"
}

resource "google_container_cluster" "cluster" {
  name               = "cluster-1"
  location           = "us-central1"
  initial_node_count = 1
  
  node_config {
    machine_type = "e2-medium"
    disk_type                 = "pd-standard"
    image_type                = "COS_CONTAINERD"
    disk_size_gb              = 10
  }
}
resource "google_compute_disk" "gke_disk"{
    name = "gke-disk-form"
    size = 10
    type = "pd-standard"
    zone = "us-central1-a"
}