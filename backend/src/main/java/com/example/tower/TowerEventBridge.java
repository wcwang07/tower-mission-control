package com.example.tower;

import io.vertx.core.AbstractVerticle;
import io.vertx.core.Vertx;
import io.vertx.core.Promise;
import io.vertx.core.http.ServerWebSocket;
import io.vertx.kafka.client.consumer.KafkaConsumer;
import java.util.*;

public class TowerEventBridge extends AbstractVerticle {

  private final List<ServerWebSocket> sockets = new ArrayList<>();

  public static void main(String[] args) {
    Vertx vertx = Vertx.vertx();
    vertx.deployVerticle(new TowerEventBridge());
  }

  @Override
  public void start(Promise<Void> startPromise) {
    Map<String, String> config = Map.of(
            "bootstrap.servers", System.getenv().getOrDefault("BOOTSTRAP_SERVERS", "kafka:9092"),
            "key.deserializer", "org.apache.kafka.common.serialization.StringDeserializer",
            "value.deserializer", "org.apache.kafka.common.serialization.StringDeserializer",
            "group.id", "tower-dashboard-group",
            "auto.offset.reset", "earliest"
    );

    KafkaConsumer<String, String> consumer = KafkaConsumer.create(vertx, config);
    consumer.partitionsFor("tower-events").onComplete(ar -> {
      if (ar.succeeded()) {
        System.out.println("📦 Partitions for tower-events: " + ar.result());
      } else {
        System.err.println("❌ Failed to fetch partitions: " + ar.cause().getMessage());
      }
    });
    vertx.createHttpServer().webSocketHandler(ws -> {
      if ("/tower-stream".equals(ws.path())) {
        sockets.add(ws);
        ws.closeHandler(v -> sockets.remove(ws));
      } else {
        ws.reject();
      }
    }).listen(8080, res -> {
      if (res.succeeded()) {
        System.out.println("✅ WebSocket server started on port 8080");
        startPromise.complete();
      } else {
        startPromise.fail(res.cause());
      }
    });

    consumer.handler(record -> {
      System.out.println("✅ Kafka record received");
      String json = record.value();
      System.out.println("📥 Consumed Kafka event: " + json);
      for (ServerWebSocket socket : sockets) {
        if (!socket.isClosed()) {
          socket.writeTextMessage(json);
        }
      }
    });

    consumer.subscribe("tower-events", ar -> {
      if (ar.succeeded()) {
        System.out.println("✅ Subscribed to topic: tower-events");
      } else {
        System.err.println("❌ Failed to subscribe to topic: " + ar.cause());
      }
    });
  }
}
